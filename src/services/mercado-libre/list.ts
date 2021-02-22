import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { Logger } from 'winston'
import { IMLItem, IMLItemInputDTO } from '../../interfaces/IMLItem'
import { ISellerItem, ISellerItemDTO } from '../../interfaces/ISellerItems'
import { IUser } from '../../interfaces/IUser'
import config from '../../config'

@Service()
export default class ListService {
    constructor(
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

    public async AddItem(itemInputDTO: Partial<IMLItemInputDTO>, currentUser: Partial<IUser>): Promise<Partial<IMLItem>> {
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
                    field: null,
                    missing: null,
                    order: null,
                    name: field.name
                }
            })
            return { ...response.data, available_orders: newAvailableOrders }
        } catch(error) {
            this.logger.error(error)
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
}