import { celebrate } from 'celebrate'
import { Router, Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { Container } from 'typedi'
import { Logger } from 'winston'
import MLAuthService from '../../../services/mercado-libre/auth'
import middleware from '../../middlewares'

const route =  Router()

export default (app: Router) => {
    app.use('', route)

    route.get(
        '/auth',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Getting access token with authorization code')
            
            try {
                const mLAuthServiceInstance = Container.get(MLAuthService)
                
                const accessCode = req.query.code
                const encodedUrl = req.query.state

                const { 
                    generatedToken,
                    originUrl
                } = await mLAuthServiceInstance.GetAccessToken(accessCode as string, encodedUrl as string)
                return res.redirect(200, originUrl)
            } catch(e) {
                return next(e)
            }
        }
    )

    route.get(
        '/access',
        celebrate({
            query: Joi.object({
                origin_url: Joi.string().required()
            })
        }),
        middleware.isAuth,
        middleware.attachCurrentUser,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Catching origin url and generating random number')
            
            try {
                const mLAuthServiceInstance = Container.get(MLAuthService)

                const originUrl = req.query.origin_url
                logger.debug('Origin URL is: ' + originUrl)
                const redirectUrl = await mLAuthServiceInstance.RedirectAuth(originUrl as string, req.currentUser)
                return res.status(200).json({ redirectUrl })
            } catch (e) {
                logger.error(e)
                return next(e)
            }
        }
    )

    route.get(
        '/refresh',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Catching origin url and generating random number')
            
            try {
                const mLAuthServiceInstance = Container.get(MLAuthService)
                await mLAuthServiceInstance.RefreshTokens()
                res.status(200).json({ message: 'Yesssss' })
            } catch (error) {
                logger.error(error)
                return next(error)
            }
        }
    )
    
    return app
}