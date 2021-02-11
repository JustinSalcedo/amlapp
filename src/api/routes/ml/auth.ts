import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { Logger } from 'winston'
import MLAuthService from '../../../services/mercado-libre/auth'

const route =  Router()

export default (app: Router) => {
    app.use('', route)

    const mLAuthServiceInstance = Container.get(MLAuthService)

    route.get(
        '/auth',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Getting access token with authorization code')
            
            try {
                const accessCode = req.query.code
                const encodedUrl = req.query.state

                const { 
                    // generatedToken,
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
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Catching origin url and generating random number')
            
            try {
                const originUrl = req.protocol + '://' + req.get('host') + req.originalUrl
                logger.debug('Origin URL is: ' + originUrl)
                const redirectUrl = await mLAuthServiceInstance.RedirectAuth(originUrl)
                return res.redirect(301, redirectUrl)
            } catch (e) {
                logger.error(e)
                next(e)
            }
        }
    )
    
    return app
}