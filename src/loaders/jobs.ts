import { Container } from 'typedi'
import config from '../config'
import Agenda from 'agenda'
import TokenRefresherJob from '../jobs/tokenRefresher'

export default ({ agenda }: { agenda: Agenda }) => {
    agenda.define(
        'refresh-token',
        { priority: 'high', concurrency: config.agenda.concurrency },
        async (job, done) => {
            const tokenRefresherJobInstance = Container.get(TokenRefresherJob)
            return tokenRefresherJobInstance.handler(job, done)
        }
    )

    agenda.start()
}