import { AxiosInstance, AxiosRequestConfig } from "axios"
import { Document } from "mongoose"
import { Inject, Service } from "typedi"
import { Logger } from "winston"
import config from "../config"
import { IAmazonItem } from "../interfaces/IAmazonItem"
import { IMLPredictedCategory } from "../interfaces/IMLCategory"
import { IMLExchangeRates } from "../interfaces/IMLExchangeRates"
import { IMLItemInputDTO } from "../interfaces/IMLItem"
import { IItemDeletedInformation, IStagingItem } from "../interfaces/IStagingItem"
import { ICustomParameters, IUser } from "../interfaces/IUser"

@Service()
export default class StagingService {
    // private mlCategories: { id: string, name: string }[]
    // private mlCategoriesIds: string[]

    constructor(
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger,
        @Inject('itemModel') private itemModel: Models.ItemModel,
        @Inject('userModel') private userModel: Models.UserModel
    ) {
        // this.mlCategories = [
        //     {
        //         "id": "MCO1747",
        //         "name": "Accesorios para Vehículos"
        //     },
        //     {
        //         "id": "MCO441917",
        //         "name": "Agro"
        //     },
        //     {
        //         "id": "MCO1403",
        //         "name": "Alimentos y Bebidas"
        //     },
        //     {
        //         "id": "MCO1071",
        //         "name": "Animales y Mascotas"
        //     },
        //     {
        //         "id": "MCO1367",
        //         "name": "Antigüedades y Colecciones"
        //     },
        //     {
        //         "id": "MCO1368",
        //         "name": "Arte, Papelería y Mercería"
        //     },
        //     {
        //         "id": "MCO1384",
        //         "name": "Bebés"
        //     },
        //     {
        //         "id": "MCO1246",
        //         "name": "Belleza y Cuidado Personal"
        //     },
        //     {
        //         "id": "MCO40433",
        //         "name": "Boletas para Espectáculos"
        //     },
        //     {
        //         "id": "MCO1039",
        //         "name": "Cámaras y Accesorios"
        //     },
        //     {
        //         "id": "MCO1743",
        //         "name": "Carros, Motos y Otros"
        //     },
        //     {
        //         "id": "MCO1051",
        //         "name": "Celulares y Teléfonos"
        //     },
        //     {
        //         "id": "MCO1648",
        //         "name": "Computación"
        //     },
        //     {
        //         "id": "MCO1144",
        //         "name": "Consolas y Videojuegos"
        //     },
        //     {
        //         "id": "MCO1276",
        //         "name": "Deportes y Fitness"
        //     },
        //     {
        //         "id": "MCO5726",
        //         "name": "Electrodomésticos"
        //     },
        //     {
        //         "id": "MCO1000",
        //         "name": "Electrónica, Audio y Video"
        //     },
        //     {
        //         "id": "MCO175794",
        //         "name": "Herramientas y Construcción"
        //     },
        //     {
        //         "id": "MCO1574",
        //         "name": "Hogar y Muebles"
        //     },
        //     {
        //         "id": "MCO1499",
        //         "name": "Industrias y Oficinas"
        //     },
        //     {
        //         "id": "MCO1459",
        //         "name": "Inmuebles"
        //     },
        //     {
        //         "id": "MCO1182",
        //         "name": "Instrumentos Musicales"
        //     },
        //     {
        //         "id": "MCO1132",
        //         "name": "Juegos y Juguetes"
        //     },
        //     {
        //         "id": "MCO3025",
        //         "name": "Libros, Revistas y Comics"
        //     },
        //     {
        //         "id": "MCO1168",
        //         "name": "Música, Películas y Series"
        //     },
        //     {
        //         "id": "MCO118204",
        //         "name": "Recuerdos, Piñatería y Fiestas"
        //     },
        //     {
        //         "id": "MCO3937",
        //         "name": "Relojes y Joyas"
        //     },
        //     {
        //         "id": "MCO1430",
        //         "name": "Ropa y Accesorios"
        //     },
        //     {
        //         "id": "MCO180800",
        //         "name": "Salud y Equipamiento Médico"
        //     },
        //     {
        //         "id": "MCO1540",
        //         "name": "Servicios"
        //     },
        //     {
        //         "id": "MCO1953",
        //         "name": "Otras categorías"
        //     }
        // ]
        // this.mlCategoriesIds = this.mlCategories.map(category => category.id)
    }

    public async DeleteItemsByID(idInput: string[]): Promise<Partial<IItemDeletedInformation>> {
        try {
            const deletedItemsInformation = await this.itemModel.deleteMany({ _id: { $in: idInput } })
            return deletedItemsInformation
        } catch (error) {
            
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

    public async SearchItemsByKeyword(keyword: string): Promise<IStagingItem[]> {
        try {
            const itemRecords = await this.itemModel.fuzzySearch(keyword)
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
            } })
    
            return userRecord.custom_parameters
        } catch (error) {
            throw error
        }
    }

    private async getExchangeRate({ custom_parameters }: Partial<IUser>, itemsInputDTO: IAmazonItem[]): Promise<{ base: string, quote: string, rate: number }> {
        let base = itemsInputDTO
            .map(item => item.currency.code)
            .reduce((acc, currentValue) => {
                if (acc === currentValue) {
                    return currentValue
                } else throw new Error('The item list must have equal currencies')
            })

        base = base ? base : 'USD'

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
            throw error
        }
    }

    public async StageItems(currentUser: Partial<IUser>, itemsInputDTO: IAmazonItem[]): Promise<IStagingItem[]> {
        this.logger.debug(`Staging items for user ${currentUser._id}`)

        try {
            const exchangeRate = await this.getExchangeRate(currentUser, itemsInputDTO)
            
            const stagingRecords = itemsInputDTO.map(async item => {
                const mlInputItem = await this.convertItem(currentUser, item, exchangeRate)
                const stagingItemRecord = await this.itemModel.create({
                    published_by: currentUser._id,
                    ml_data: mlInputItem,
                    amazon_data: item
                })

                return stagingItemRecord
            })

            return Promise.all(stagingRecords)
        } catch (error) {
            
        }
    }

    private async convertItem({ custom_parameters }: Partial<IUser>, itemDTO: IAmazonItem, exchangeRate: { base: string, quote: string, rate: number }): Promise<IMLItemInputDTO> {
        try {
            const {
                productTitle,
                categories,
                price,
                variations,
                // currency,
                warehouseAvailability,
                productDescription,
                features,
                imageUrlList
            } = itemDTO
    
            const convertedPrice = this.convertPrice(price, exchangeRate, { custom_parameters })
    
            const convertedQuantity = this.generateQuantity(warehouseAvailability, custom_parameters.default_quantity)
    
            const { category_id, attributes } = await this.matchCategory(productTitle)
    
            const convertedAttributes = this.convertAttributes({ attributes })
            
            const convertedItem: IMLItemInputDTO = {
                title: productTitle,
                category_id,
                price: convertedPrice,
                // variations,
                currency_id: exchangeRate.quote,
                available_quantity: convertedQuantity,
                buying_mode: custom_parameters.buying_mode,
                condition: custom_parameters.item_condition,
                listing_type_id: custom_parameters.listing_type_id,
                description: { plain_text: productDescription },
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
        return attributes.map(attr => {
            return { id: attr.id, value_name: attr.id }
        })
    }

    private convertPictureList(amazonPictures: string[]): { source: string }[] {
        const mlPicturesList = amazonPictures.map(pictureUrl => {
            return { source: pictureUrl }
        })

        return  mlPicturesList
    }

    private convertPrice(price: number, { rate }: { rate: number }, { custom_parameters }: Partial<IUser> ): number {
        let profit = custom_parameters.profit_margin
        if (custom_parameters.is_profit_percentage) {
            profit = profit * price * 0.01
        }

        const convertedPrice = price * rate + profit

        return convertedPrice
    }

    private async matchCategory(amazonProductTitle: string) : Promise<IMLPredictedCategory> {
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/sites/MCO/domain_discovery/search?q=${amazonProductTitle}`,
            method: requestMethod,
            baseURL: config.mlAPI.url
        }

        try {
            const response: { data: IMLPredictedCategory } = await this.axios(requestConfig)
            return response.data
        } catch (error) {
            
        }
    }

    private generateQuantity(availability: string, quantityInput: number): number {
        if (availability === 'In Stock.') {
            return quantityInput
        } else return 0
    }

    public async updateMLInputData({ _id }: Partial<IStagingItem>, mlInputData: Partial<IMLItemInputDTO>): Promise<IStagingItem> {
        try {
            const itemRecord = await this.itemModel.findById(_id).select('ml_data')
            const newMLDataInput = Object.assign(itemRecord.ml_data, mlInputData)
            const updatedItemRecord = await this.itemModel.findByIdAndUpdate(_id, { $set: {
                ml_data: newMLDataInput
            } })

            return updatedItemRecord
        } catch (error) {
            
        }
    }
}