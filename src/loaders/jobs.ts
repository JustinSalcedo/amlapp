import { Container } from 'typedi'
import config from '../config'
import Agenda from 'agenda'
import MLTokenRefresherJob from '../jobs/mlTokenRefresher'
import AutoSyncJob from '../jobs/autoSync'

export default ({ agenda }: { agenda: Agenda }) => {
    agenda.define(
        'refresh-mltokens',
        { priority: 'high', concurrency: config.agenda.concurrency },
        async (job, done) => {
            const tokenRefresherJobInstance = Container.get(MLTokenRefresherJob)
            return tokenRefresherJobInstance.handler(job, done)
        }
    );

    agenda.define(
        'auto-sync',
        { priority: 'high', concurrency: config.agenda.concurrency },
        async (job, done) => {
            const autoSyncJobInstance = Container.get(AutoSyncJob)
            return autoSyncJobInstance.handler(job, done)
        }
    );

    (async () => {
        await agenda.start()

        await agenda.every('15 minutes', 'refresh-mltokens')

        await agenda.every('hour', 'auto-sync')
    })()
}