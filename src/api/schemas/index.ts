import { MLQueryType, MLMutationType } from './ml'

import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'

import { ItemInputType } from './ml/types'

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ml: {
            type: MLQueryType,
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