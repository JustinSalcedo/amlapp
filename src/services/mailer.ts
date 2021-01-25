import { Service, Inject } from 'typedi'
import { IUser } from '../interfaces/IUser'

@Service()
export default class MailerService {
    constructor(
        @Inject('emailClient') private emailClient
    ) {}

    public async SendWelcomeEmail(email) {
        const data = {
            from: 'Juanito Alcachofa <me@samples.mailgun.org>',
            to: email,
            subject: "What's uuuppp",
            text: 'Testing our little Mailgun budy'
        }

        this.emailClient.messages().send(data)
        return { delivered: 1, status: 'ok' }
    }

    public StartEmailSequence(sequence: string, user: Partial<IUser>) {
        if (!user.email) {
            throw new Error('No email provided')
        }

        return {delivered: 1, status: 'ok'}
    }
}