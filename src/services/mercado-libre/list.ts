import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IItem, IItemInputDTO } from '../../interfaces/IItem'
import config from '../../config'

@Service()
export default class ListService {
    constructor(
        @Inject('axios') private axios: AxiosInstance
    ) {}

    public async AddItem(itemInputDTO: IItemInputDTO): Promise<IItem> {
        const requestMethod = 'post'
        const requestConfig: AxiosRequestConfig = {
            url: config.mlAPI.list.url,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                // 'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: itemInputDTO,
            // withCredentials: true
        }

        try {
            const response = await this.axios(requestConfig)
            return response.data
        } catch (e) {
            throw e
        }
    }
}