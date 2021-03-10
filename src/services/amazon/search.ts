import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Service, Inject } from 'typedi'
import { Logger } from 'winston'
import config from '../../config'
import { IAmazonItem } from '../../interfaces/IAmazonItem'
import { IAmazonSearchOptions, IAmazonSearchResults } from '../../interfaces/IAmazonSearchResults'
import { IUser } from '../../interfaces/IUser'

@Service()
export default class SearchService {
    constructor(
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) {}

    public async GetItemDetailsByASIN(currentUser: Partial<IUser>, { asin, merchant }: { asin: string, merchant: string | null }): Promise<IAmazonItem> {
        let productUrl = `https://www.amazon.com/-/es/dp/${asin}`
        const itemDetails = await this.GetItemDetailsByURL(currentUser, { productUrl, merchant })
        return itemDetails
    }

    public async GetItemDetailsByURL(currentUser: Partial<IUser>, { productUrl, merchant }: {  productUrl: string, merchant: string | null }): Promise<IAmazonItem> {
        let url = `/amz/amazon-lookup-product?url=${productUrl}`

        if (merchant) {
            url = url + `&merchant=${merchant}`
        }

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

        try {
            const response = await this.axios(requestConfig)
            return response.data as IAmazonItem
        } catch (error) {
            throw error
        }
    }

    public async SearchItemsByKeyword(currentUser: Partial<IUser>, { keyword, sortBy, page }: IAmazonSearchOptions): Promise<IAmazonSearchResults> {
        this.logger.debug(`Searching items for '${keyword}' keyword`)

        let url = `/amz/amazon-search-by-keyword-asin?keyword=${keyword}&domainCode=com&page=${page}`

        if (sortBy) {
            url = url + `&sortBy=${sortBy}`
        }

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

        try {
            const response: { data: IAmazonSearchResults } = await this.axios(requestConfig)
            return response.data
        } catch (error) {
            throw error
        }
    }
}