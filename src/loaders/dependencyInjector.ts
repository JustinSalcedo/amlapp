import { Container } from 'typedi'
import AxiosInstance from 'axios'
import LoggerInstance from './logger'

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model)
        })

        // const agendaInstance = agendaFactory({ mongoConnection })

        Container.set('logger', LoggerInstance)

        Container.set('axios', AxiosInstance)
        
        // LoggerInstance.info('Agenda injectedinto container')
        LoggerInstance.info('Dependencies injected')
    } catch(e) {
        LoggerInstance.error('Error on dependency injector loader: %o', e)
        throw e
    }
}