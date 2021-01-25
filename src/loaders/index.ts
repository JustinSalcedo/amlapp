import expressLoader from './express'
import dependencyInjector from './dependencyInjector'
import mongooseLoader from './mongoose'
import Logger from './logger'
import './events'

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader()
    Logger.info('DB Loaded and connected')

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default
    }

    await dependencyInjector({
        mongoConnection,
        models: [
            userModel
        ]
    })
    Logger.info('Dependency Injector loaded')

    await expressLoader({ app: expressApp })
    Logger.info('Express loaded')
}