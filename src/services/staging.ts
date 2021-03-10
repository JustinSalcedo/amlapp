import { AxiosInstance, AxiosRequestConfig } from "axios"
import { readFileSync } from "fs"
import { Inject, Service } from "typedi"
import { Logger } from "winston"
import config from "../config"
import { EventDispatcher } from "../decorators/eventDispatcher"
import { IAmazonItem, IAmazonMiniItem } from "../interfaces/IAmazonItem"
import { IMLPredictedCategory } from "../interfaces/IMLCategory"
import { IMLExchangeRates } from "../interfaces/IMLExchangeRates"
import { IMLItemInputDTO } from "../interfaces/IMLItem"
import { IItemDeletedInformation, IStagingItem } from "../interfaces/IStagingItem"
import { ICustomParameters, IUser } from "../interfaces/IUser"
import events from "../subscribers/events"

@Service()
export default class StagingService {
    private allowedCategories: { category_ids: string[] }
    
    constructor(
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger,
        @Inject('itemModel') private itemModel: Models.ItemModel,
        @Inject('userModel') private userModel: Models.UserModel,
        @EventDispatcher() private eventDispatcher
    ) {
        let rawData = readFileSync(__dirname + '/CATEGORY_IDS.json').toString()
        this.allowedCategories = JSON.parse(rawData)
    }

    public async DeleteItemsByID(currentUser: Partial<IUser>, idInput: string[]): Promise<Partial<IItemDeletedInformation>> {
        try {
            const deletedItemsInformation = await this.itemModel.deleteMany({ _id: { $in: idInput } })

            this.eventDispatcher.dispatch(events.item.delete, { currentUser, itemIds: idInput })

            return deletedItemsInformation
        } catch (error) {
            throw error
        }
    }

    public async GetItemsByID(idInput: string[]): Promise<IStagingItem[]> {
        try {
            const itemRecords = await this.itemModel.find().in('_id', idInput)
            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async GetItemsByASIN(asinInput: string[]): Promise<IStagingItem[]> {
        try {
            const itemRecords = await this.itemModel.find().in('amazon_data.asin', asinInput)
            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async GetAllItems({ _id, items }: Partial<IUser>): Promise<IStagingItem[]> {
        this.logger.debug('Getting all items for user %s and items %o', _id, items)

        try {
            const itemRecords = await this.itemModel.find().in('_id', items)
            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async GetAllPublishedItems({ _id, items }: Partial<IUser>): Promise<IStagingItem[]> {
        this.logger.debug('Getting all published items for user %s and items %o', _id, items)

        try {
            const itemRecords = await this.itemModel.find().nor([{ ml_id: null }, { ml_id: { $exists: false } }]).in('_id', items)
            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async GetAllNoPublishedItems({ _id, items }: Partial<IUser>): Promise<IStagingItem[]> {
        this.logger.debug('Getting all no-published items for user %s and items %o', _id, items)

        try {
            const itemRecords = await this.itemModel.find().and([{ ml_id: null }, { ml_id: { $exists: false } }]).in('_id', items)
            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async SearchItemsByKeyword(keyword: string): Promise<IStagingItem[]> {
        try {
            const regExpression = new RegExp(keyword, 'i')
            const itemRecords = await this.itemModel.find().regex('ml_data.title', regExpression)

            return itemRecords
        } catch (error) {
            throw error
        }
    }

    public async SetParameters({ _id, custom_parameters }: Partial<IUser>, inputParameters: Partial<ICustomParameters>): Promise<ICustomParameters> {
        try {
            const newCustomParameters = Object.assign(custom_parameters, inputParameters)

            const userRecord: IUser = await this.userModel.findByIdAndUpdate(_id, { $set: {
                custom_parameters: newCustomParameters
            } }, { new: true })
    
            return userRecord.custom_parameters
        } catch (error) {
            throw error
        }
    }

    private async getExchangeRate({ custom_parameters }: Partial<IUser>, itemsInputDTO: IAmazonMiniItem[]): Promise<{ base: string, quote: string, rate: number }> {
        let base = itemsInputDTO
            .map(item => {
                if (item.currency) {
                    return item.currency.code
                } else return 'USD'
            })
            .reduce((acc, currentValue) => {
                if (acc === currentValue) {
                    return currentValue
                } else throw new Error('The item list must have equal currencies')
            })

        const quote = custom_parameters.local_currency_code

        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/currency_conversions/search?from=${base}&to=${quote}`,
            method: requestMethod,
            baseURL: config.mlAPI.url
        }
        
        try {
            const response: { data: IMLExchangeRates } = await this.axios(requestConfig)
            return { base, quote, rate: response.data.rate }
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    public async AutoStageItemsByASIN(currentUser: Partial<IUser>, asins: string[]): Promise<IStagingItem[]> {
        try {
            const amazonItems = asins.map(async asin => {
                let productUrl = `https://www.amazon.com/dp/${asin}`
                let url = `/amz/amazon-lookup-product?url=${productUrl}`

                const requestMethod = 'get'
                const requestConfig: AxiosRequestConfig = {
                    url,
                    method: requestMethod,
                    baseURL: config.amazonAPI.url,
                    headers: {
                        'x-rapidapi-key': currentUser.config.rapidapi_key,
                        'x-rapidapi-host': config.amazonAPI.host
                    }
                }

                const response = await this.axios(requestConfig)
                return response.data as IAmazonItem
            })

            const itemsInput = await Promise.all(amazonItems)
            const stagedItems = await this.StageItems(currentUser, itemsInput)
            return stagedItems
        } catch (error) {
            throw error
        }
    }

    public async StageItems(currentUser: Partial<IUser>, itemsInputDTO: IAmazonMiniItem[]): Promise<IStagingItem[]> {
        this.logger.debug(`Staging items for user ${currentUser._id}`)

        try {
            const exchangeRate = await this.getExchangeRate(currentUser, itemsInputDTO)
            this.logger.debug('Our itemsInput is:\n%o', itemsInputDTO)
            
            const stagingRecords = itemsInputDTO.map(async item => {
                const mlInputItem = await this.convertItem(currentUser, item, exchangeRate)
                const stagingItemRecord = await this.itemModel.create({
                    published_by: currentUser._id,
                    ml_data: mlInputItem,
                    amazon_data: item
                })

                return stagingItemRecord
            })

            const resolvedRecords = await Promise.all(stagingRecords)
            const itemIds = resolvedRecords.map(item => item._id)

            this.eventDispatcher.dispatch(events.item.stage, { currentUser, itemIds })

            return resolvedRecords
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    private async convertItem({ custom_parameters }: Partial<IUser>, itemDTO: IAmazonMiniItem, exchangeRate: { base: string, quote: string, rate: number }): Promise<IMLItemInputDTO> {
        try {
            const {
                productTitle,
                // categories,
                price,
                variations,
                warehouseAvailability,
                productDescription,
                productDetails,
                features,
                imageUrlList
            } = itemDTO

            if (price <= 0) {
                throw new Error('The item must have a price bigger than 0')
            }
    
            const matchedCategory = await this.matchCategory(productTitle)

            if (!matchedCategory) {
                throw new Error(`This product's category is not allowed. Try another item.`)
            }

            const { category_id, attributes } = matchedCategory as IMLPredictedCategory

            const secureTitle = this.cutProductTitle(productTitle)
    
            // const secureDescription = this.convertToPlainText(productDescription)
            let secureDescription = ''
            if (productDescription.trim()) {
                secureDescription = this.convertToPlainText(this.filterInvalidStrings(productDescription))
            } else {
                secureDescription = this.convertToPlainText(this.filterInvalidStrings(features.join('. ')))
            }
            
            const convertedPrice = this.convertPrice(price, exchangeRate, { custom_parameters })
    
            const convertedQuantity = this.generateQuantity(warehouseAvailability, custom_parameters.default_quantity)
    
            const convertedAttributes = this.convertAttributes({ attributes })
            
            const convertedItem: IMLItemInputDTO = {
                title: secureTitle,
                category_id,
                price: convertedPrice,
                // variations,
                currency_id: exchangeRate.quote,
                available_quantity: convertedQuantity,
                buying_mode: custom_parameters.buying_mode,
                condition: custom_parameters.item_condition,
                listing_type_id: custom_parameters.listing_type_id,
                description: { plain_text: secureDescription },
                video_id: 'YOUTUBE_ID_HERE',
                tags: features,
                sale_terms: custom_parameters.sale_terms,
                pictures: this.convertPictureList(imageUrlList),
                attributes: convertedAttributes  ///////
            }

            return convertedItem
        } catch (error) {
            throw error
        }
    }

    private convertAttributes({ attributes }: Partial<IMLPredictedCategory>): { id: string, value_name: string }[] {
        try {
            return attributes.map(attr => {
                return { id: attr.id, value_name: attr.id }
            })
        } catch (error) {
            this.logger.error('Method StagingService.convertAttributes failed: %o', error)
            throw error
        }
    }

    private convertPictureList(amazonPictures: string[]): { source: string }[] {
        try {
            const mlPicturesList = amazonPictures.map(pictureUrl => {
                return { source: pictureUrl }
            })
    
            return  mlPicturesList
        } catch (error) {
            this.logger.error('Method StagingService.convertPicturesList failed: %o', error)
            throw error
        }
    }

    private convertPrice(price: number, { rate }: { rate: number }, { custom_parameters }: Partial<IUser> ): number {
        let profit = custom_parameters.profit_margin
        if (custom_parameters.is_profit_percentage) {
            profit = profit * price * 0.01
        }

        const convertedPrice = Math.round(price * rate + profit)

        return convertedPrice
    }

    private async matchCategory(amazonProductTitle: string) : Promise<IMLPredictedCategory | boolean> {
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/sites/MCO/domain_discovery/search?q=${encodeURIComponent(amazonProductTitle)}`,
            method: requestMethod,
            baseURL: config.mlAPI.url
        }

        try {
            const response: { data: IMLPredictedCategory[] } = await this.axios(requestConfig)

            let result: IMLPredictedCategory | boolean
            response.data.forEach((predictedCategory, index) => {
                if (this.isAllowedCategory(predictedCategory.category_id)) {
                    result = predictedCategory
                    return true
                } else if (index === response.data.length - 1) {
                    result = false
                    return false
                }
            })

            if(result) {
                this.logger.debug('The matched category for product %s is %o', amazonProductTitle, result)
            }
            return result
        } catch (error) {
            this.logger.error('Method StagingService.matchCategory failed: %o', error)
            throw error
        }
    }

    private generateQuantity(availability: string, quantityInput: number): number {
        if (availability === 'In Stock.') {
            return quantityInput
        } else return 0
    }

    public async UpdateMLInputData({ _id }: Partial<IStagingItem>, mlInputData: Partial<IMLItemInputDTO>): Promise<IStagingItem> {
        this.logger.debug('Updating item %s', _id)
        
        try {
            const itemRecord = await this.itemModel.findById(_id).select('ml_data')
            let newMLDataInput = Object.assign(itemRecord.ml_data, mlInputData)
            if (mlInputData.title) {
                newMLDataInput = { ...newMLDataInput, title: this.cutProductTitle(mlInputData.title) }
            }
            if (mlInputData.description.plain_text) {
                newMLDataInput = { ...newMLDataInput, description: { plain_text: this.convertToPlainText(this.filterInvalidStrings(mlInputData.description.plain_text)) } }
            }
            const updatedItemRecord = await this.itemModel.findByIdAndUpdate(_id, { $set: {
                ml_data: newMLDataInput
            } }, { new: true })

            return updatedItemRecord
        } catch (error) {
            this.logger.error('Method StagingService.UpdateMLInputData failed: %o', error)
            throw error
        }
    }

    private isAllowedCategory(category: string): boolean {
        return this.allowedCategories.category_ids.includes(category)
    }

    public GetAllowedCategoriesIds(): string[] {
        try {
            return this.allowedCategories.category_ids
        } catch (error) {
            throw error
        }
    }

    private cutProductTitle(productTitle: string): string {
        if (productTitle.length > 60) {
            let cutTitle = productTitle.slice(0, 60)
            if (productTitle[60] !== ' ') {
                while(cutTitle[cutTitle.length - 1] !== ' ') {
                    cutTitle = cutTitle.slice(0, cutTitle.length - 1)
                }
            }

            return cutTitle.trim()
        } else return productTitle
    }

    private convertToPlainText(text: string): string {
        return text.split('').map(char => {
            let code = char.charCodeAt(0)
    
            if (
                (code < 32)
                || ((code === 42) || (code === 43))
                || ((code > 59) && (code < 63))
                || ((code > 90) && (code < 97))
                || (code === 241 || (code === 209))
                || (code > 122)
            ) {
                return ' '
            }
            
            switch (code) {
                case 35:
                    return ' '
                case 47:
                    return '-'
                case 64:
                    return 'at'
                case 209:
                    return char
                case 241:
                    return char
                default:
                    return char
            }
        }).join('').replace(/\s{2,}/g, ' ').trim()
    }

    private filterInvalidStrings(text: string): string {
        return text
            .replace(/\d{3}-\d{8}|\d{4}-\d{7}|\(\d{2,4}\)\d{6,7}|\(\d{2,4}\) \d{3} \d{4}|\(\d{2,4}\)\.\d{3}\.\d{4}|\(\d{2,4}\)-\d{3}-\d{4}|\d{2,4} \d{3,7} \d{0,4}|\d{2,4}-\d{3,7}-\d{0,4}|\d{10}|\+\d{1,3}\d{10}|\(\d{2,3}\) \d{3,4}-\d{3,4}|\+\d{1,3} \(\d{2,3}\) \d{3,4}-\d{3,4}/g, '-')
            .replace(/[a-zA-Z0-9-_]{1,}@[a-zA-Z0-9-_]{1,}\.[a-zA-Z]{1,}/g, '-')
            .replace(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))|[a-zA-Z0-9-_]{1,}\.[a-zA-Z]{1,}/g, '-')

        /* Matchs for
        (021)1234567
        (123) 456 7899
        (123).456.7899
        (123)-456-7899
        123-456-7899
        123 456 7899
        1234567899
        0511-4405222
        021-87888822
        +8613012345678
        (442) 217-7562
        +1 (442) 217-7562

        test@email.com
        test1@email.net
        web@lifether.com

        regexbuddy.com
        www.regexbuddy.com
        http://regexbuddy.com
        http://www.regexbuddy.com
        http://www.regexbuddy.com/
        http://www.regexbuddy.com/index.html
        http://www.regexbuddy.com/index.html?source=library
        http://www.regexbuddy.com/download.html.
        www.domain.com/quoted
        */
    }
}