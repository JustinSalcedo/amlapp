import { Router, Request, Response, NextFunction, response } from 'express'

const route = Router()

export default (app: Router) => {
    app.use('/config', route)

    
}