import { Router } from 'express'
import profile from './profile'

const route = Router()

export default (app: Router) => {
    app.use('/user', route)

    profile(route)
}