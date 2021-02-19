import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { Logger } from 'winston'
import { IItem, IItemInputDTO } from '../../interfaces/IItem'
import { ISellerItem, ISellerItemDTO } from '../../interfaces/ISellerItems'
import { IUser } from '../../interfaces/IUser'
import config from '../../config'

@Service()
export default class ListService {
    constructor(
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) { }

    public async GetItemDetails(itemId: string, currentUser: IUser): Promise<IItem> {
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

    public async GetItemsDetails(itemIds: string[], currentUser: IUser): Promise<IItem[]> {
        const ids = itemIds.join(',')
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/items/${ids}`,
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

    public async AddItem(itemInputDTO: Partial<IItemInputDTO>, currentUser: Partial<IUser>): Promise<Partial<IItem>> {
        this.logger.debug('Adding item with input \n%o\n and user as \n%o\n', itemInputDTO, currentUser)
        
        const requestMethod = 'post'
        const requestConfig: AxiosRequestConfig = {
            url: '/items',
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
            },
            data: itemInputDTO
        }

        try {
            const response = await this.axios(requestConfig)
            return response.data
        } catch (error) {
            throw error
        }
    }

    public async GetItemsBySeller(currentUser: Partial<IUser>, { status, sellerSKU }: Partial<{ status: string, sellerSKU: string }>): Promise<ISellerItem> {
        this.logger.debug(`Getting items by seller with ID ${currentUser._id}`)
        
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/users/${currentUser._id}/items/search`
                + (status || sellerSKU) ? '?' : ''
                + status ? `status=${status}` : ''
                + sellerSKU ? `&seller_sku=${sellerSKU}` : '',
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Authorization': `Bearer ${currentUser.config.ml_token.access_token}`,
            }
        }

        try {
            const response: { data: ISellerItemDTO } = await this.axios(requestConfig)
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
                    field: field.id,
                    missing: null,
                    order: null,
                    name: null
                }
            })
            return { ...response.data, available_orders: newAvailableOrders }
        } catch(error) {
            throw error
        }
    }
}