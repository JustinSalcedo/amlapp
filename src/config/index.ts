import dotenv from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (envFound.error) {
    throw new Error("Couldn't file .env file")
}

export default {
    port: parseInt(process.env.PORT, 10),
    databaseURL: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
        prefix: '/api'
    },
    mlAPI: {
        url: process.env.ML_API_URI,
        redirect: {
            url: process.env.AUTHORIZED_URL,
            prefix: '/ml'
        },
        appID: process.env.ML_APP_ID,
        auth: {
            url: process.env.ML_API_AUTH_PREFIX
        },
        accessUrl: process.env.ML_AUTH_URI,
        secret: process.env.ML_APP_SECRET
    },
    amazonAPI: {
        url: process.env.RAPIDAPI_AMAZON_URI,
        host: process.env.RAPIDAPI_HOST
    },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
    }
}