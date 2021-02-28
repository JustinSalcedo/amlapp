import { AxiosInstance, AxiosRequestConfig } from "axios";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import config from "../config";
import { IExchangeRates } from "../interfaces/IExchangeRates";
import { IUser } from "../interfaces/IUser";

@Service()
export default class ExchangerService {
    constructor (
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) {}

    public async SetRates(userRecord: Partial<IUser> | undefined): Promise<void> {
        const requestMethod = 'get'
        const requestConfig: AxiosRequestConfig = {
            url: `/latest.json?app_id=${config.exchangerAPI.appID}&base=${config.exchangerAPI.globalCurrency}`,
            method: requestMethod,
            baseURL: config.exchangerAPI.url
        }

        if (userRecord) {
            this.logger.debug(`Updating exchange rates with base currency ${config.exchangerAPI.globalCurrency} for new user ${userRecord._id}`)

            try {
                const response: { data: IExchangeRates } = await this.axios(requestConfig)
                await this.userModel.findByIdAndUpdate(userRecord._id, { $set: {
                    config: { ...userRecord.config, exchange_rates: response.data }
                } })
            } catch (error) {
                throw error
            }
        } else {
            this.logger.debug(`Updating exchange rates with base currency ${config.exchangerAPI.globalCurrency} for all users`)
    
            try {
                const response: { data: IExchangeRates } = await this.axios(requestConfig)
                const userRecords: Partial<IUser[]> = await this.userModel.where('config').ne(null).select('_id config')
                userRecords.forEach(async user => {
                    await this.userModel.findByIdAndUpdate(user._id, { $set: {
                        config: { ...user.config, exchange_rates: response.data }
                    } })
                })
            } catch (error) {
                throw error
            }
        }
    }
}