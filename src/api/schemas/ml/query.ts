import { Container } from 'typedi'
import ListService from '../../../services/mercado-libre/list'

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLScalarType
} from 'graphql'

import {
    ItemType, SellerItemsIDsType
} from './types'

const MLQueryType = new GraphQLObjectType({
    name: 'MLQueryType',
    fields: {
        itemDetails: {
            type: ItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const item = await listServiceInstance.GetItemDetails(args.id, context.currentUser)
                return item
            }
        },
        itemsDetails: {
            type: new GraphQLList(ItemType),
            args: {
                ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) }
            },
            async resolve(parentObj, args, context) {
                const listServiceInstance = Container.get(ListService)
                const items = await listServiceInstance.GetItemsDetails(args.ids, context.currentUser)
                return items
            }
        },
        itemsIDsBySeller: {
            type: SellerItemsIDsType,
            args: {
                status: { type: GraphQLString },
                sellerSKU: { type: GraphQLString }
            },
            async resolve(parentObj, args, context) {
                let options = {
                    status: args.status ? args.status : null,
                    sellerSKU: args.sellerSKU ? args.sellerSKU : null
                }

                const listServiceInstance = Container.get(ListService)
                const sellerItemsIds = await listServiceInstance.GetItemsBySeller(context.currentUser, options)
                return sellerItemsIds
            }
        },
        itemsDetailsBySeller: {
            type: new GraphQLList(ItemType),
            args: {
                status: { type: GraphQLString },
                sellerSKU: { type: GraphQLString }
            },
            async resolve(parentObj, args, context) {
                let options = {
                    status: args.status ? args.status : null,
                    sellerSKU: args.sellerSKU ? args.sellerSKU : null
                }

                const listServiceInstance = Container.get(ListService)
                const items = await listServiceInstance.GetItemsDetailsBySeller(context.currentUser, options)
                return items
            }
        }
    }
})

export default MLQueryType