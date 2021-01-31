import { Router } from 'express'
import config from './config'

const route = Router()

export default (app: Router) => {
    app.use('/user', route)

    config(route)
}