import { AxiosInstance, AxiosRequestConfig } from "axios"
import { Inject, Service } from "typedi"
import { Logger } from "winston"
import config from "../config"
import { IAmazonItem, IAmazonMiniItem } from "../interfaces/IAmazonItem"
import { IStagingItem } from "../interfaces/IStagingItem"
import { IUser } from "../interfaces/IUser"
import _ from "lodash";

@Service()
export default class SynchronizerService {
    constructor(
        @Inject('itemModel') private itemModel: Models.ItemModel,
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) {}

    public async AutoSyncAllowedItems(currentUser: Partial<IUser>): Promise<IStagingItem[]> {
        this.logger.debug('Auto-synchronizing item for user %s', currentUser._id)
        
        try {
            const lastSyncDate = new Date(currentUser.config.last_item_sync_date.toString())
            const nextSyncDate = new Date(lastSyncDate.getTime() + currentUser.custom_parameters.sync_concurrency_in_hours)
            
            if (nextSyncDate <= new Date()) {
                const itemRecords = await this.itemModel.find().and([{ _id: { $in: currentUser.items } }, { allow_sync: true }])
                const updatedRecords = await this.updateAmazonData(currentUser, itemRecords)

                await this.userModel.findByIdAndUpdate(currentUser._id, { $set: {
                    config: { ...currentUser.config, last_item_sync_date: new Date() }
                } })

                return updatedRecords
            } else return []
        } catch (error) {
            throw error
        }
    }

    public async SyncItemsById(currentUser: Partial<IUser>, idInput: string[]): Promise<IStagingItem[]> {
        this.logger.silly('Synchronizing items manually')
        
        try {
            const itemRecords = await this.itemModel.find({ _id: { $in: idInput } })
            const updatedRecords = await this.updateAmazonData(currentUser, itemRecords)
            return updatedRecords
        } catch (error) {
            throw error
        }
    }

    private async updateAmazonData(currentUser: Partial<IUser>, itemRecords: IStagingItem[]): Promise<IStagingItem[]> {
        try {
            const updatedItems = itemRecords.map(async record => {
                let productUrl = `https://www.amazon.com/-/es/dp/${record.amazon_data.asin}`
                let url = `/amz/amazon-lookup-product?url=${productUrl}`

                const requestConfig: AxiosRequestConfig = {
                    url,
                    method: 'get',
                    baseURL: config.amazonAPI.url,
                    headers: {
                        'x-rapidapi-key': currentUser.config.rapidapi_key,
                        'x-rapidapi-host': config.amazonAPI.host
                    }
                }

                try {
                    const response: { data: IAmazonItem } = await this.axios(requestConfig)
                    const newAmazonData = {
                        asin: response.data.asin,
                        productTitle: response.data.productTitle,
                        price: response.data.price,
                        variations: response.data.variations,
                        currency: response.data.currency,
                        warehouseAvailability: response.data.warehouseAvailability,
                        productDescription: response.data.productDescription,
                        productDetails: response.data.productDetails,
                        features: response.data.features,
                        imageUrlList: response.data.imageUrlList
                    } as IAmazonMiniItem

                    if(_.isEqual(newAmazonData, record.amazon_data)) {
                        return false
                    } else {
                        const updatedItem = await this.itemModel.findByIdAndUpdate(record._id, { $set: {
                            amazon_data: newAmazonData
                        } }, { new: true })
                        return updatedItem
                    }
                } catch (error) {
                    this.logger.error('Error when getting updating the item %s: %o', record._id, error)
                    return false
                }
            })

            const resolvedRecords = (await Promise.all(updatedItems)).filter(record => record)
            return resolvedRecords as IStagingItem[]
        } catch (error) {
            throw error
        }
    }
 
}