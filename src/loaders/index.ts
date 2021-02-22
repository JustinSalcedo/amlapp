import expressLoader from './express'
import dependencyInjector from './dependencyInjector'
import mongooseLoader from './mongoose'
import jobsLoader from './jobs'
import Logger from './logger'
import './events'

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader()
    Logger.info('DB Loaded and connected')

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default
    }

    const itemModel = {
        name: 'itemModel',
        model: require('../models/item')
    }

    const { agenda } = dependencyInjector({
        mongoConnection,
        models: [
            userModel,
            itemModel
        ]
    })

    Logger.info('Dependency Injector loaded')

    jobsLoader({ agenda })
    Logger.info('Jobs loaded')

    expressLoader({ app: expressApp })
    Logger.info('Express loaded')
}