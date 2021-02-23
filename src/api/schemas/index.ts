import { MLQueryType, MLMutationType } from './ml'
import { AmazonQueryType } from './amazon'

import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ml: {
            type: MLQueryType,
            resolve() {
                return true
            }
        },
        amazon: {
            type: AmazonQueryType,
            resolve() {
                return true
            }
        }
    }
})

const RootMutationType = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        ml: {
            type: MLMutationType,
            resolve() {
                return true
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

export default schema