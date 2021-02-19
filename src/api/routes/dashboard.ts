import { Router, Request, Response } from 'express'
import { graphqlHTTP } from 'express-graphql'
import middleware from '../middlewares'
import schema from '../schemas'

export default (app: Router) => {
    app.use(
        '/dashboard',
        middleware.isAuth,
        middleware.attachCurrentUser,
        graphqlHTTP({
            schema: schema,
            graphiql: true
        })
    )
    app.use(
        '/dashboardtest',
        graphqlHTTP({
            schema: schema,
            graphiql: true
        })
    )
}