import { Container } from 'typedi'
import config from '../config'
import Agenda from 'agenda'
import MLTokenRefresherJob from '../jobs/mlTokenRefresher'

export default ({ agenda }: { agenda: Agenda }) => {
    agenda.define(
        'refresh-mltokens',
        { priority: 'high', concurrency: config.agenda.concurrency },
        async (job, done) => {
            const tokenRefresherJobInstance = Container.get(MLTokenRefresherJob)
            return tokenRefresherJobInstance.handler(job, done)
        }
    );

    (async () => {
        await agenda.start()

        await agenda.every('15 minutes', 'refresh-mltokens')
    })()
}