import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { Logger } from 'winston'

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    const Logger: Logger = Container.get('logger')

    try {
        const UserModel = Container.get('userModel') as Models.UserModel
        const userRecord = await UserModel.findById(req.token._id)

        if (!userRecord) {
            return res.sendStatus(401)
        }
        
        const currentUser = userRecord.toObject()
        Reflect.deleteProperty(currentUser, 'password')
        Reflect.deleteProperty(currentUser, 'salt')
        req.currentUser = currentUser
        return next()
    } catch (error) {
        Logger.error('Error attaching user to req: %o', error)
        return next(error)
    }
}

export default attachCurrentUser