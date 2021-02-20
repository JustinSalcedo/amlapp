import { Container, Inject } from 'typedi'
// import MLAuthService from '../services/mercado-libre/auth'
import { Logger } from 'winston'
import { Job } from 'agenda'

export default class TokenRefresherJob {
    constructor(
        @Inject('logger') private logger: Logger
    ) {}

    public async handler(job: Job, done: (err: Error) => void): Promise<void> {
        try {
            this.logger.debug('Token Refresher Job triggered')

            // const { currentUser } = job.attrs.data
            // const mlAuthServiceInstance = Container.get(MLAuthService)
            // await mlAuthServiceInstance.RefreshToken(currentUser)
        } catch (error) {
            this.logger.error('Error with Token Refresher Job: %o', error)
            done(error)
        }
    }
}