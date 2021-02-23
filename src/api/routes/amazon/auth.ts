import { celebrate } from 'celebrate'
import { Router, Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { Container } from 'typedi'
import { Logger } from 'winston'
import AmazonAuthService from '../../../services/amazon/auth'
import middleware from '../../middlewares'

const route =  Router()

export default (app: Router) => {
    app.use('', route)

    route.post(
        '/add-api-key',
        celebrate({
            body: Joi.object({
                rapidapi_key: Joi.string().required()
            })
        }),
        middleware.isAuth,
        middleware.attachCurrentUser,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Posting Rapidapi key for current user')
            
            try {
                const amazonAuthServiceInstance = Container.get(AmazonAuthService)
                
                const apiKey = req.body.rapidapi_key

                await amazonAuthServiceInstance.AddAPIKey(req.currentUser, apiKey as string)
                return res.status(200).json({ message: 'API Key added successfully' })
            } catch(e) {
                logger.error(e)
                return next(e)
            }
        }
    )
    
    return app
}