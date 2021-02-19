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
            url: 'https://amlapp.justinsalcedo.com',
            prefix: '/ml'
        },
        appID: process.env.ML_APP_ID,
        auth: {
            url: process.env.ML_API_AUTH_PREFIX
        },
        accessUrl: process.env.ML_AUTH_URI,
        secret: process.env.ML_APP_SECRET
    }
}