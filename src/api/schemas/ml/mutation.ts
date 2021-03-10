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
        publishItemsByID: {
            type: new GraphQLList(ItemType),
            args: {
                ids: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const publishedItems = await listServiceInstance.PublishItemsById(context.currentUser, args.ids)
                return publishedItems
            }
        },
        publishAll: {
            type: new GraphQLList(ItemType),
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const publishedItems = await listServiceInstance.PublishAllItems(context.currentUser)
                return publishedItems
            }
        },
        unpublishItemsByID: {
            type: new GraphQLList(ItemType),
            args: {
                ids: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const unpublishedItems = await listServiceInstance.UnpublishItemsByID(context.currentUser, args.ids)
                return unpublishedItems
            }
        },
        unpublishAndDeleteItemsByID: {
            type: new GraphQLList(ItemType),
            args: {
                ids: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const unpublishedItems = await listServiceInstance.UnpublishItemsByID(context.currentUser, args.ids, true)
                return unpublishedItems
            }
        }
    }
})

export default MLMutationType