import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logger } from 'winston'
import { IMLItem, IMLItemInputDTO } from '../../interfaces/IMLItem'
import { IMLSellerItem, IMLSellerItemDTO } from '../../interfaces/IMLSellerItems'
import { IUser } from '../../interfaces/IUser'
import config from '../../config'
import { IStagingItem } from '../../interfaces/IStagingItem'
import { IMLDescription } from '../../interfaces/IMLDescription'
import { resolve } from 'path'
// import { IMLCategoryChildren } from '../../interfaces/IMLCategory'

@Service()
export default class ListService {
    constructor(
        @Inject('itemModel') private itemModel: Models.ItemModel,
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) { }

    public async GetItemDetails(itemId: string, currentUser: IUser): Promise<IMLItem> {
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/items/${itemId}`,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`
            }
        }

        try {
            const response = await this.axios(requestConfig)
            return response.data
        } catch (error) {
            throw error
        }
    }

    public async GetItemsDetails(itemIds: string[], currentUser: Partial<IUser>): Promise<IMLItem[]> {
        const ids = itemIds.join(',')
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/items?ids=${ids}`,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`
            }
        }

        try {
            const response = await this.axios(requestConfig)
            const itemsDetails = response.data.map(element => {
                if (element.code === 200) {
                    return element.body
                }
            })

            return itemsDetails
            
        } catch (error) {
            throw error
        }
    }

    public async GetItemsBySeller(currentUser: Partial<IUser>, { status, sellerSKU }: Partial<{ status: string, sellerSKU: string }>): Promise<IMLSellerItem> {
        this.logger.debug(`Getting items by seller with ID ${currentUser.config.ml_token.user_id}`)
        
        const requestMethod = 'get'
        let url = `/users/${currentUser.config.ml_token.user_id}/items/search`
        if (status || sellerSKU) {
            url = url + '?'
            let statusString = status ? `status=${status}` : ''
            let skuString = sellerSKU ? `&seller_sku=${sellerSKU}` : ''
            url = url + statusString + skuString
        }

        const requestConfig: AxiosRequestConfig = {
            url,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
            }
        }

        try {
            const response: { data: IMLSellerItemDTO } = await this.axios(requestConfig)
            const newAvailableOrders = response.data.available_orders.map(field => {
                if (typeof field.id !== 'string') {
                    return {
                        id: field.id.id,
                        field: field.id.field,
                        missing: field.id.missing,
                        order: field.id.order,
                        name: field.name
                    }
                } else return {
                    id: field.id as string,
                    field: null,
                    missing: null,
                    order: null,
                    name: field.name
                }
            })
            return { ...response.data, available_orders: newAvailableOrders }
        } catch(error) {
            this.logger.error('Error trying to fetch all seller items IDs: %o', error)
            throw error
        }
    }

    public async GetItemsDetailsBySeller(currentUser: Partial<IUser>, { status, sellerSKU }: Partial<{ status: string, sellerSKU: string }>): Promise<IMLItem[]> {
        this.logger.debug(`Getting items details by seller with ID ${currentUser.config.ml_token.user_id}`)

        try {
            const { results } = await this.GetItemsBySeller(currentUser, { status, sellerSKU })
            const itemsDetails = await this.GetItemsDetails(results, currentUser)
            return itemsDetails
        } catch (error) {
            throw error
        }
    }

    public async GetItemDescriptionsByID(currentUser: Partial<IUser>, mlIdInput: string[]): Promise<IMLDescription[]> {
        this.logger.debug('Getting item descriptions for user %s', currentUser._id)

        try {
            const itemDescriptions = mlIdInput.map(async mlId => {
                const requestConfig: AxiosRequestConfig = {
                    url: `/items/${mlId}/description`,
                    method: 'get',
                    baseURL: config.mlAPI.url,
                    headers: {
                        'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
                    }
                }
                try {
                    const response: { data: IMLDescription } = await this.axios(requestConfig)
                    return response.data
                } catch (error) {
                    this.logger.error(error)
                    throw error
                }
            })

            const resolvedDescriptions = await Promise.all(itemDescriptions)
            return resolvedDescriptions
        } catch (error) {
            this.logger.error('Error trying to get item descriptions: %o', error)
            throw error
        }
    }

    public async PublishItemsById(currentUser: Partial<IUser>, idInput: string[]): Promise<IMLItem[]> {
        try {
            const itemRecords = await this.itemModel.find().or([{ ml_id: null }, { ml_id: { $exists: false } }]).in('_id', idInput)
            const publishedItems = await this.addManyItems(currentUser, itemRecords)
            return publishedItems
        } catch (error) {
            throw error
        }
    }

    public async PublishAllItems(currentUser: Partial<IUser>): Promise<IMLItem[]> {
        this.logger.debug('Publishing all items for user %s', currentUser._id)

        try {
            const itemRecords = await this.itemModel.find().or([{ ml_id: null }, { ml_id: { $exists: false } }]).in('_id', currentUser.items)
            const publishedItems = await this.addManyItems(currentUser, itemRecords)
            return publishedItems
        } catch (error) {
            throw error
        }
    }

    public async UnpublishItemsByID(currentUser: Partial<IUser>, idInput: string[], deleteItems?: boolean): Promise<IMLItem[]> {
        this.logger.debug('Unpublishing items for user %s', currentUser._id)
        
        try {
            const itemRecords = await this.itemModel.find().in('_id', idInput)
            let updatedRecords = []
            if(deleteItems) {
                updatedRecords = itemRecords.map(record => {
                    const parsedRecord = record.toObject()
                    return {
                        ...parsedRecord,
                        allow_sync: false,
                        ml_data: { ...record.ml_data, available_quantity: 0 }
                    }
                })
            } else {
                updatedRecords = itemRecords.map(async record => {
                    const updatedRecord = await this.itemModel.findByIdAndUpdate(record._id, { $set: {
                        allow_sync: false,
                        ml_data: { ...record.ml_data, available_quantity: 0 }
                    } }, { new: true })
                    
                    return updatedRecord
                })
            }

            let resolvedRecords = []
            if(deleteItems) {
                resolvedRecords = updatedRecords
                this.logger.debug('Deleting - Our resolved records are: %o', resolvedRecords)
            } else {
                resolvedRecords = await Promise.all(updatedRecords)
                this.logger.debug('Just publishing - Our resolved records are: %o', resolvedRecords)
            }

            const updatedMLItems = await this.UpdateManyItems(currentUser, resolvedRecords)
            if (deleteItems) {
                await this.itemModel.deleteMany({ _id: { $in: idInput } })
            }
            return updatedMLItems
        } catch (error) {
            this.logger.error('Error trying to unpublish items: %o', error)
            throw error
        }
    }

    public async UpdateManyItems(currentUser: Partial<IUser>, itemRecords: IStagingItem[]): Promise<IMLItem[]> {
        try {
            const queuedItems = itemRecords.map(async record => {
                const updated = await this.updateItem(currentUser, record)
                return updated
            })

            return Promise.all(queuedItems)
        } catch (error) {
            this.logger.error('Error trying to update items: %o', error)
            throw error
        }
    }

    //////// Private methods ////////

    private async addItem(currentUser: Partial<IUser>, itemInputDTO: IMLItemInputDTO): Promise<IMLItem> {
        this.logger.debug('Adding item with input \n%o\n and user as \n%s\n', itemInputDTO, currentUser._id)
        
        const {
            title,
            category_id,
            price,
            official_store_id,
            currency_id,
            available_quantity,
            buying_mode,
            condition,
            listing_type_id,
            description,
            video_id,
            sale_terms,
            pictures,
            attributes
        } = itemInputDTO
        
        const requestMethod = 'post'
        let requestConfig: AxiosRequestConfig = {
            url: '/items',
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
            },
            data: {
                title,
                category_id,
                price,
                official_store_id,
                currency_id,
                available_quantity,
                buying_mode,
                condition,
                listing_type_id,
                description,
                video_id,
                sale_terms,
                pictures,
                attributes 
            } as IMLItemInputDTO
        }

        try {
            const response = await this.axios(requestConfig)
            return response.data
        } catch (error) {
            this.logger.error('Error in method ListService.addItem: %o', error)
            throw error
        }
    }

    private async addManyItems(currentUser: Partial<IUser>, itemRecords: IStagingItem[]): Promise<IMLItem[]> {
        try {
            const queuedItems = itemRecords.map(async record => {
                const published = await this.addItem(currentUser, record.ml_data)
                if (published) {
                    await this.itemModel.findByIdAndUpdate(record._id, { $set: {
                        ml_id: published.id
                    } })
                }
                return published
            })

            return Promise.all(queuedItems)
        } catch (error) {
            throw error
        }
    }

    private async updateItem(currentUser: Partial<IUser>, { ml_data, ml_id }: Partial<IStagingItem>): Promise<IMLItem> {
        this.logger.debug('Updating item %s', ml_id)
        
        const {
            title,
            category_id,
            price,
            official_store_id,
            currency_id,
            available_quantity,
            buying_mode,
            condition,
            description,
            video_id,
            sale_terms,
            pictures,
            attributes
        } = ml_data
        
        const requestMethod = 'put'
        const itemRequestConfig: AxiosRequestConfig = {
            url: `/items/${ml_id}`,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
            },
            data: {
                title,
                category_id,
                price,
                official_store_id,
                currency_id,
                available_quantity,
                buying_mode,
                condition,
                video_id,
                sale_terms,
                pictures,
                attributes 
            } as IMLItemInputDTO
        }

        const descriptionRequestConfig: AxiosRequestConfig = {
            url: `/items/${ml_id}/description?api_version=2`,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
                'Content-Type': 'application/json'
            },
            data: description
        }
        
        try {
            await this.axios(descriptionRequestConfig)
            const response: { data: IMLItem } = await this.axios(itemRequestConfig)
            return response.data
        } catch (error) {
            this.logger.error('Error trying to update this item: %o', error)
            throw error
        }
    }

    /* Temporary service method to get all categories' children */

    // public async GetCategoriesChildren(list: string): Promise<IMLCategoryChildren[]> {
    //     const categoryIds = list.split(',')
    //     if(categoryIds.length === 0) {
    //         throw new Error('Empty array of categories')
    //     }

    //     try {
    //         const populatedCategories = await this.fetAllCategoryChildren(categoryIds)
    //         return populatedCategories
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // private async fetAllCategoryChildren(categoryIds: string[]): Promise<IMLCategoryChildren[]> {
    //     const requestConfig: AxiosRequestConfig = {
    //         url: '/categories/',
    //         method: 'get',
    //         baseURL: config.mlAPI.url
    //     }
        
    //     try {
    //         const populatedCategories = categoryIds.map(async categoryId => {
    //             const customRequest = { ...requestConfig, url: requestConfig.url + categoryId }
    //             this.logger.debug('The axios request is %o', customRequest)
    //             const response: { data: IMLCategoryChildren } = await this.axios(customRequest)
                
    //             if (response.data.children_categories.length === 0) {
    //                 response.data.children_categories = null
    //             } else {
    //                 const childrenIds = response.data.children_categories.map(children => children.id)
    //                 response.data.children_categories = await this.fetAllCategoryChildren(childrenIds)
    //             }

    //             return {
    //                 id: response.data.id,
    //                 name: response.data.name,
    //                 children_categories: response.data.children_categories
    //             }
    //         })

    //         const resolvedCategories = await Promise.all(populatedCategories)
    //         return resolvedCategories
    //     } catch (error) {
    //         this.logger.error('Error triggered fetching category children: %o', error)
    //         if (error.isAxiosError) {
    //             return false
    //         } else {
    //             throw error
    //         }
    //     }
    // }
}