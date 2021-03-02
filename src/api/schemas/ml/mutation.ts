import { Container } from 'typedi'
import ListService from '../../../services/mercado-libre/list'

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
} from 'graphql'

import {
    ItemDataInputType,
    ItemType
} from './types'

const MLMutationType = new GraphQLObjectType({
    name: 'MLMutationType',
    fields: {
        listItem: {
            type: ItemType,
            args: {
                item: { type: new GraphQLNonNull(ItemDataInputType) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const item = await listServiceInstance.AddItem(args.item, context.currentUser)
                return item
            }
        }
    }
})

export default MLMutationType