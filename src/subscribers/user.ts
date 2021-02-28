import { Container } from 'typedi'
import { EventSubscriber, On } from 'event-dispatch'
import events from './events'
import { IUser } from '../interfaces/IUser'
import mongoose from 'mongoose'
import { Logger } from 'winston'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import IMLToken from '../interfaces/IMLToken'
import config from '../config'
import ExchangerService from '../services/exchanger'

@EventSubscriber()
export default class UserSubscriber {
    @On(events.user.signIn)
    public onUserSignIn({ _id }: Partial<IUser>) {
        const Logger: Logger = Container.get('logger')

        try {
            const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>

            UserModel.updateOne({ _id }, { $set: { lastLogin: new Date() } })
        } catch (e) {
            Logger.error(`Error on event ${events.user.signIn}: %o`, e)

            throw e
        }
    }

    @On(events.user.signUp)
    public async onUserSignUp({ user }: { user: Partial<IUser> }) {
        const Logger: Logger = Container.get('logger')

        try {
            Logger.silly('User signed up')

            const ExchangerServiceInstance = Container.get(ExchangerService)
            await ExchangerServiceInstance.SetRates(user)
        } catch (e) {
            Logger.error(`Error on event ${events.user.signUp}: %o`, e)

            throw e
        }
    }

    @On(events.user.mlAuth)
    public async onUserMLAuth({ currentUser, mlToken }: { currentUser: Partial<IUser>, mlToken: IMLToken }) {
        const Logger: Logger = Container.get('logger')

        try {
            Logger.silly('ML authorization granted')
            Logger.debug('We got currentUser as \n%o\n and mlToken as \n%o\n', currentUser, mlToken)

            const Axios: AxiosInstance = Container.get('axios')
            const requestMethod = 'get'
            const requestConfig: AxiosRequestConfig = {
                url: '/users/me',
                method: requestMethod,
                baseURL: config.mlAPI.url,
                headers: {
                    'Authorization': `Bearer ${mlToken.access_token}`,
                }
            }

            const response = await Axios(requestConfig)
            const UserModel = Container.get('userModel') as Models.UserModel
            await UserModel.findByIdAndUpdate(currentUser._id, { $set: {
                config: { ...currentUser.config, ml_token: mlToken, ml_access_date: new Date() },
                ml_account: response.data
            } })

        } catch (error) {
            Logger.error(`Error on event ${events.user.signUp}: %o`, error)
            throw error
        }
    }
}