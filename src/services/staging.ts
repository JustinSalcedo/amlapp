import { AxiosInstance } from "axios"
import { Inject, Service } from "typedi"
import { Logger } from "winston"
import { IAmazonItem } from "../interfaces/IAmazonItem"
import { IExchangeRates } from "../interfaces/IExchangeRates"
import { IMLItemInputDTO } from "../interfaces/IMLItem"
import { IItemDeletedInformation, IStagingItem } from "../interfaces/IStagingItem"
import { ICustomParameters, IUser } from "../interfaces/IUser"
import item from "../models/item"

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
            const userRecord: IUser = await this.userModel.findByIdAndUpdate(_id, { $set: {
                custom_parameters: {
                    profit_margin: inputParameters.profit_margin ? inputParameters.profit_margin : custom_parameters.profit_margin,
                    default_quantity: inputParameters.default_quantity ? inputParameters.default_quantity : custom_parameters.default_quantity,
                    is_profit_percentage: inputParameters.is_profit_percentage ? inputParameters.is_profit_percentage : custom_parameters.is_profit_percentage,
                    buying_mode: inputParameters.buying_mode ? inputParameters.buying_mode : custom_parameters.buying_mode,
                    item_condition: inputParameters.item_condition ? inputParameters.item_condition : custom_parameters.item_condition,
                    listing_type_id: inputParameters.listing_type_id ? inputParameters.listing_type_id : custom_parameters.listing_type_id,
                    sale_terms: inputParameters.sale_terms ? inputParameters.sale_terms : custom_parameters.sale_terms
                }
            } })
    
            return userRecord.custom_parameters
        } catch (error) {
            throw error
        }
    }

    public async StageItems(currentUser: Partial<IUser>, itemsInputDTO: IAmazonItem[]): Promise<IStagingItem[]> {
        this.logger.debug(`Staging items for user ${currentUser._id}`)

        try {
            itemsInputDTO.forEach(item => {

            })
        } catch (error) {
            
        }
    }

    private convertItem({ config, custom_parameters }: Partial<IUser>, itemDTO: IAmazonItem): IMLItemInputDTO {
        const {
            productTitle,
            categories,
            price,
            variations,
            currency,
            warehouseAvailability,
            productDescription,
            features,
            imageUrlList
        } = itemDTO

        const convertingParams = {
            exchange_rates: config.exchange_rates,
            profit_margin: custom_parameters.profit_margin,
            is_profit_percentage: custom_parameters.is_profit_percentage
        }
        const convertedPrice = this.convertPrice(price, convertingParams, currency)
        
        const convertedItem: IMLItemInputDTO = {
            title: productTitle,
            category_id: this.matchCategory(categories[0]),
            price: convertedPrice.price,
            // variations,
            currency_id: convertedPrice.currency_id,
            available_quantity: this.generateQuantity(warehouseAvailability, custom_parameters.default_quantity),
            buying_mode: custom_parameters.buying_mode,
            condition: custom_parameters.item_condition,
            listing_type_id: custom_parameters.listing_type_id,
            description: { plain_text: productDescription },
            video_id: 'YOUTUBE_ID_HERE',
            tags: features,
            sale_terms: custom_parameters.sale_terms,
            pictures: this.convertPictureList(imageUrlList),
            attributes  ///////
        }
    }

    private convertPictureList(amazonPictures: string[]): { source: string }[] {
        const mlPicturesList = amazonPictures.map(pictureUrl => {
            return { source: pictureUrl }
        })

        return  mlPicturesList
    }

    private convertPrice(price: number, { exchange_rates, profit_margin, is_profit_percentage }: { exchange_rates: IExchangeRates, profit_margin: number, is_profit_percentage: boolean }, { code }: { code: string }): { price: number, currency_id: string } {
        const validCode = code ? code : 'USD'

        let profit = profit_margin
        if (is_profit_percentage) {
            profit = profit * price * 0.01
        }

        const convertedPrice = price / exchange_rates.rates[validCode] + profit

        return { price: convertedPrice, currency_id: exchange_rates.base }
    }

    private matchCategory(amazonCategory: string) : string {
        switch (amazonCategory) {
            case "Audible Books & Originals":
				return "MCO3025"

			case "Amazon Devices":
				return "MCO1000"

			case "Amazon Pharmacy":
				return "MCO180800"

			case "Appliances":
				return "MCO5726"

			case "Apps & Games":
				return "MCO1144"

			case "Arts, Crafts & Sewing":
				return "MCO1368"

			case "Automotive Parts & Accessories":
				return "MCO1747"

			case "Baby":
				return "MCO1384"

			case "Beauty & Personal Care":
				return "MCO1246"

			case "Books":
				return "MCO3025"

			case "CDs & Vinyl":
				return "MCO1168"

			case "Cell Phones & Accessories":
				return "MCO1051"

			case "Clothing, Shoes & Jewelry":
				return "MCO1430"

			case "Women":
				return "MCO1430"

			case "Men":
				return "MCO1430"

			case "Girls":
				return "MCO1430"

			case "Boys":
				return "MCO1430"

			case "Collectibles & Fine Art":
				return "MCO1367"

			case "Computers":
				return "MCO1648"

			case "Courses":
				return "MCO1540"

			case "Digital Educational Resources":
				return "MCO1540"

			case "Digital Music":
				return "MCO1168"

			case "Electronics":
				return "MCO1000"

			case "Garden & Outdoor":
				return "MCO1574"

			case "Grocery & Gourmet Food":
				return "MCO1403"

			case "Handmade":
				return "MCO1368"

			case "Health, Household & Baby Care":
				return "MCO1574"

			case "Home & Business Services":
				return "MCO1540"

			case "Home & Kitchen":
				return "MCO1574"

			case "Industrial & Scientific":
				return "MCO1499"

			case "Kindle Store":
				return "MCO3025"

			case "Luggage & Travel Gear":
				return "MCO1430"

			case "Magazine Subscriptions":
				return "MCO3025"

			case "Movies & TV":
				return "MCO1168"

			case "Musical Instruments":
				return "MCO1182"

			case "Office Products":
				return "MCO1499"

			case "Pet Supplies":
				return "MCO1071"

			case "Premium Beauty":
				return "MCO1246"

			case "Smart Home":
				return "MCO1000"

			case "Software":
				return "MCO1648"

			case "Sports & Outdoors":
				return "MCO1276"

			case "Tools & Home Improvement":
				return "MCO175794"

			case "Toys & Games":
				return "MCO1132"

			case "Vehicles":
				return "MCO1743"

			case "Video Games":
				return "MCO1144"

			case "Whole Foods Market":
				return "MCO1403"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            default:
                return "MCO1953"
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