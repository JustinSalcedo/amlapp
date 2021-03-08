import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import AuthService from '../../services/auth'
import { IUserInputDTO } from '../../interfaces/IUser'
import middlewares from '../middlewares'
import { celebrate, Joi } from 'celebrate'
import { Logger } from 'winston'
// import ListService from '../../services/mercado-libre/list'

const route = Router()

export default (app: Router) => {
    app.use('/auth', route)

    route.post(
        '/signup',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling Sign-Up endpoint with body: %o', req.body)
            try {
                const authServiceInstance = Container.get(AuthService)
                const { user, token } = await authServiceInstance.SignUp(req.body as IUserInputDTO)
                return res.status(201).json({ user, token })
            } catch (e) {
                logger.error('Error: %o, e')
                return next(e)
            }
        }
    )

    route.post(
        '/signin',
        celebrate({
          body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
          })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling Sign-In endpoint with body: %o', req.body)
            try {
                const { email, password } = req.body
                const authServiceInstance = Container.get(AuthService)
                const { user, token } = await authServiceInstance.SignIn(email, password)
                return res.json({ user, token }).status(200)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger')
        logger.debug('Calling Sign-Out endpoint with body: %o', req.body)
        try {
            return res.status(200).end()
        } catch (e) {
            logger.error('Error: %o', e)
            return next(e)
        }
    })

    /* Temporary route to get children categories */
    // route.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
    //     const logger: Logger = Container.get('logger')
    //     logger.debug('Calling Categories endpoint with query: %o', req.query)
    //     try {
    //         const listOfCategories = req.query.list
    //         const listServiceInstance = Container.get(ListService)

    //         const populatedCategories = await listServiceInstance.GetCategoriesChildren(listOfCategories as string)
    //         return res.json({ populatedCategories }).status(200)
    //     } catch (error) {
    //         logger.error('Error: %o', error)
    //         return next(error)
    //     }
    // })
}