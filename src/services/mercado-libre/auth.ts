import { Service, Inject } from 'typedi'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { randomBytes } from 'crypto'
import argon2 from 'argon2'
import { Logger } from 'winston'
import IMLToken from '../../interfaces/IMLToken'
import config from '../../config'

@Service()
export default class MLAuthService {
    private origin: string

    constructor (
        @Inject('axios') private axios: AxiosInstance,
        @Inject('logger') private logger: Logger
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
                + 'client_id=' + config.mlAPI.appID
                + 'client_secret=' + config.mlAPI.secret
                + 'code=' + accessCode
                + 'redirect_uri=' + config.mlAPI.redirect.url
        }
        
        const validOrigin = await argon2.verify(encodedUrl, this.origin)

        if (validOrigin) {
            this.logger.silly('Posting access code to ML server')
            const response = await this.axios(requestConfig)
            this.logger.silly('Generating token')
            const generatedToken: IMLToken = response.data
            const originUrl = this.origin
            return { generatedToken, originUrl }
        } else {
            throw new Error('Invalid origin')
        }
    }

    public async RedirectAuth(originUrl: string) {
        const authUrl = config.mlAPI.accessUrl
        const appID = config.mlAPI.appID
        const redirectUrl = config.mlAPI.redirect.url + config.mlAPI.redirect.prefix
        this.origin = originUrl

        const { url } = await this.EncodeURL(this.origin)

        return `${authUrl}?response_type=code&client_id=${appID}&state=${url}&redirect_uri=${redirectUrl}`
    }

    private async EncodeURL(originUrl: string) {
        try {
            const salt = randomBytes(32)

            this.logger.silly('Hashing url')
            const hashedUrl = await argon2.hash(originUrl, { salt })
            return {
                salt: salt.toString('hex'),
                url: hashedUrl
            }
        } catch(e) {
            this.logger.error(e)
            throw e
        }
    }
}