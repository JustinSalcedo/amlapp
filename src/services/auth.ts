import { Service, Inject } from 'typedi'
import jwt from 'jsonwebtoken'
// import MailerService from './mailer'
/* Bro, there's no mailer service! */
import config from '../config'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import { IUser, IUserInputDTO } from '../interfaces/IUser'
import { EventDispatcher} from '../decorators/eventDispatcher'
import events from '../subscribers/events'

@Service()
export default class AuthService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        // private mailer: MailerService
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher
    ) {}

    public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        try {
            const salt = randomBytes(32)

            this.logger.silly('Hashing password')
            const hashedPassword = await argon2.hash(userInputDTO.password, { salt })
            this.logger.silly('Creating user db record')
            const userRecord = await this.userModel.create({
                ...userInputDTO,
                salt: salt.toString('hex'),
                password: hashedPassword
            })
            this.logger.silly('Generating JWT')
            const token = this.generateToken(userRecord)

            if (!userRecord) {
                throw new Error('User cannot be created')
            }

            this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord })

            const user = userRecord.toObject()
            Reflect.deleteProperty(user, 'password')
            Reflect.deleteProperty(user, 'salt')
            Reflect.deleteProperty(user, 'config')
            Reflect.deleteProperty(user, 'redirect_urls')
            return { user, token }
        }   catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const userRecord = await this.userModel.findOne({ email })
        if (!userRecord) {
            throw new Error('User not registered')
        }

        this.logger.silly('Checking password')
        const validPassword = await argon2.verify(userRecord.password, password)
        if (validPassword) {
            this.logger.silly('Password is valid')
            this.logger.silly('Generating JWT')
            const token = this.generateToken(userRecord)

            const user = userRecord.toObject()
            Reflect.deleteProperty(user, 'password')
            Reflect.deleteProperty(user, 'salt')
            Reflect.deleteProperty(user, 'config')
            Reflect.deleteProperty(user, 'redirect_urls')

            return { user, token }
        } else {
            throw new Error('Invalid Password')
        }
    }

    public async ChangePassword({ _id }: Partial<IUser>, { oldPassword, newPassword }: { oldPassword: string, newPassword: string }): Promise<{ user: IUser; token: string }> {
        const userRecord = await this.userModel.findById(_id)
        if (!userRecord) {
            throw new Error('User not registered')
        }

        try {
            this.logger.silly('Changing password')
            const validPassword = await argon2.verify(userRecord.password, oldPassword)
            
            if (validPassword) {
                const salt = randomBytes(32)

                this.logger.silly('Hashing New Password')
                const hashedPassword = await argon2.hash(newPassword, { salt })
                this.logger.silly('Updating user db record')
                const updatedUserRecord = await this.userModel.findByIdAndUpdate(_id, { $set: {
                    salt: salt.toString('hex'),
                    password: hashedPassword
                } }, { new: true })
                this.logger.silly('Generating New JWT')
                const token = this.generateToken(updatedUserRecord)

                if (!updatedUserRecord) {
                    throw new Error('User cannot be updated')
                }

                const user = updatedUserRecord.toObject()
                Reflect.deleteProperty(user, 'password')
                Reflect.deleteProperty(user, 'salt')
                Reflect.deleteProperty(user, 'config')
                Reflect.deleteProperty(user, 'redirect_urls')
                return { user, token }
            } else {
                throw new Error('Invalid  Old Password')
            }
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    private generateToken(user: IUser) {
        const today = new Date()
        const exp = new Date(today)
        exp.setDate(today.getDate() + 60)

        this.logger.silly(`Sign JWT for userId: ${user._id}`)
        return jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000
            },
            config.jwtSecret
        )
    }
}