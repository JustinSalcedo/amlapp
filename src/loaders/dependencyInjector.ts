import { Container } from 'typedi'
import AxiosInstance from 'axios'
import agendaFactory from './agenda'
import LoggerInstance from './logger'

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model)
        })

        const agendaInstance = agendaFactory({ mongoConnection })

        Container.set('agendaInstance', agendaInstance)
        Container.set('logger', LoggerInstance)
        Container.set('axios', AxiosInstance)
        
        LoggerInstance.info('Agenda injected into container')
        LoggerInstance.info('Dependencies injected')

        return { agenda: agendaInstance }
    } catch(e) {
        LoggerInstance.error('Error on dependency injector loader: %o', e)
        throw e
    }
}