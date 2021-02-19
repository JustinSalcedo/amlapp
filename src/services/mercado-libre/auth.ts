import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logger } from 'winston'
import { IUser } from '../../interfaces/IUser'
import IMLToken from '../../interfaces/IMLToken'
import { EventDispatcher } from '../../decorators/eventDispatcher'
import config from '../../config'
import events from '../../subscribers/events'

@Service()
export default class MLAuthService {
    private origin: string

    constructor (
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger,
        @EventDispatcher() private eventDispatcher
    ) {}
    
    public async GetAccessToken(accessCode: string, encodedUrl: string): Promise<{ generatedToken: IMLToken, originUrl: string }> {
        if (!accessCode || !encodedUrl) {
            throw new Error('Access code not found')
        }
        
        const requestMethod = 'post'
        const requestConfig: AxiosRequestConfig = {
            url: config.mlAPI.auth.url,
            method: requestMethod,
            baseURL: config.mlAPI.url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=authorization_code'
                + '&client_id=' + config.mlAPI.appID
                + '&client_secret=' + config.mlAPI.secret
                + '&code=' + accessCode
                + '&redirect_uri=' + config.mlAPI.redirect.url + config.mlAPI.redirect.prefix + '/auth'
        }

        const encodedUrlArray = encodedUrl.split('/')

        const userId = encodedUrlArray[encodedUrlArray.length - 2]

        const userRecord: IUser = await this.userModel.findById(userId)
        
        if (encodedUrl === userRecord.redirect_urls.ml_access) {
            this.logger.silly('Posting access code to ML server')
            const response = await this.axios(requestConfig)
            this.logger.silly('Generating token')
            const generatedToken: IMLToken = response.data
            this.eventDispatcher.dispatch(events.user.mlAuth, { currentUser: userRecord, mlToken: generatedToken })

            const randomEntry = encodedUrlArray[encodedUrlArray.length - 1]
            const originUrl = encodedUrl.replace(`${userId}/${randomEntry}`, '')
            return { generatedToken, originUrl }
        } else {
            throw new Error('Invalid origin')
        }
    }

    public async RedirectAuth(originUrl: string, currentUser: Partial<IUser>) {
        const random = Math.floor(Math.random() * 1000000)
        const verifiedUrl = `${originUrl}/${currentUser._id}/${random}`

        await this.userModel.findByIdAndUpdate(currentUser._id, { $set: { redirect_urls: { ...currentUser.redirect_urls, ml_access: verifiedUrl } } })

        const authUrl = config.mlAPI.accessUrl
        const appID = config.mlAPI.appID
        const redirectUrl = config.mlAPI.redirect.url + config.mlAPI.redirect.prefix + '/auth'

        return `${authUrl}?response_type=code&client_id=${appID}&state=${verifiedUrl}&redirect_uri=${redirectUrl}`
    }
}