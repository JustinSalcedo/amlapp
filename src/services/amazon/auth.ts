import { Inject, Service } from 'typedi'
import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import { Logger } from 'winston'
import { IUser } from '../../interfaces/IUser'

@Service()
export default class AmazonAuthService {
    constructor (
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
    ) {}

    public async AddAPIKey(currentUser: Partial<IUser>, apiKey: string): Promise<void> {
        this.logger.debug('Adding Rapidapi API key for user %s', currentUser._id)

        try {
            await this.userModel.findByIdAndUpdate(currentUser._id, { $set: {
                config: { ...currentUser.config, rapidapi_key: apiKey }
            } })
        } catch (error) {
            throw error
        }
    }
}