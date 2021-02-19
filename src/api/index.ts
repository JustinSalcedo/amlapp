import { Router } from 'express'
import auth from './routes/auth'
import user from './routes/user'
import dashboard from './routes/dashboard'

export default () => {
    const app = Router()
    auth(app)
    user(app)
    dashboard(app)

    return app
}