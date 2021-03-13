import { celebrate, Joi } from 'celebrate'
import { Router, Request, Response, NextFunction, response } from 'express'
import Container from 'typedi'
import { Logger } from 'winston'
import AuthService from '../../../services/auth'
import UserService from '../../../services/user'
import middlewares from '../../middlewares'

const route = Router()

export default (app: Router) => {
    app.use('/profile', route)

    route.get(
        '/data',
        middlewares.isAuth,
        middlewares.attachCurrentUser,
        (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling data endpoint with userID: %s', req.currentUser._id)

            try {
                const user = req.currentUser
                Reflect.deleteProperty(user, 'config')
                Reflect.deleteProperty(user, 'redirect_urls')
                return res.json({ user }).status(200)
            } catch (error) {
                logger.error('Error: %o', error)
                return next(error)
            }
        }
    )

    route.patch(
        '/data',
        celebrate({
            body: Joi.object({
                email: Joi.string(),
                name: Joi.string()
            })
        }),
        middlewares.isAuth,
        middlewares.attachCurrentUser,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling data endpoint with body: %o', req.body)
            
            try {
                const { email, name } = req.body
                const userServiceInstance = Container.get(UserService)
                const user = await userServiceInstance.UpdateProfileData(req.currentUser, { inputName: name, inputEmail: email })
                return res.json({ user }).status(200)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.post(
        '/change-password',
        celebrate({
            body: Joi.object({
                current_password: Joi.string().required(),
                new_password: Joi.string().required()
            })
        }),
        middlewares.isAuth,
        middlewares.attachCurrentUser,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling Change-Password endpoint with body: %o', req.body)
            
            try {
                const { current_password, new_password } = req.body
                const authServiceInstance = Container.get(AuthService)
                const { user, token } = await authServiceInstance.ChangePassword(req.currentUser, { oldPassword: current_password, newPassword: new_password })
                return res.json({ user, token }).status(200)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.get(
        '/configuration-status',
        middlewares.isAuth,
        middlewares.attachCurrentUser,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling configuration status endpoint for user: %o', req.currentUser._id)
            
            try {
                const userServiceInstance = Container.get(UserService)
                const configuration_status = await userServiceInstance.monitorUserConfigStatus(req.currentUser)
                return res.json({ configuration_status }).status(200)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}