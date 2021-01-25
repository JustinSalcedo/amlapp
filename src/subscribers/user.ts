import { Container } from 'typedi'
import { EventSubscriber, On } from 'event-dispatch'
import events from './events'
import { IUser } from '../interfaces/IUser'
import mongoose from 'mongoose'
import { Logger } from 'winston'

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
    public onUserSignUp({ name, email, _id }: Partial<IUser>) {
        const Logger: Logger = Container.get('logger')

        try {
            Logger.silly('User signed up')
        } catch (e) {
            Logger.error(`Error on event ${events.user.signUp}: %o`, e)

            throw e
        }
    }
}