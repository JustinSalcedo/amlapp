import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import schema from '../schemas'

export default (app: Router) => {
    app.use('/dashboard', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))
}