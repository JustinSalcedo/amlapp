import { Container } from 'typedi'
import StagingService from '../../../services/staging'

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
    StagedItemType
} from './types'

const StageQueryType = new GraphQLObjectType ({
    name: 'StageQueryType',
    fields: {
        getItemsByID: {
            type: new GraphQLList(StagedItemType),
            args: {
                ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            async resolve(parentObj, args) {
                const stagingServiceInstance = Container.get(StagingService)
                const recordedItems = await stagingServiceInstance.GetItemsByID(args.ids)
                return recordedItems
            }
        },
        getItemsByASIN: {
            type: new GraphQLList(StagedItemType),
            args: {
                asins: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            async resolve(parentObj, args) {
                const stagingServiceInstance = Container.get(StagingService)
                const recordedItems = await stagingServiceInstance.GetItemsByASIN(args.asins)
                return recordedItems
            }
        },
        getAllItems: {
            type: new GraphQLList(StagedItemType),
            async resolve(parentObj, args, context) {
                const stagingServiceInstance = Container.get(StagingService)
                const recordedItems = await stagingServiceInstance.GetAllItems(context.currentUser)
                return recordedItems
            }
        },
        searchItemsByKeyword: {
            type: new GraphQLList(StagedItemType),
            args: {
                keyword: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parentObj, args) {
                const stagingServiceInstance = Container.get(StagingService)
                const recordedItems = await stagingServiceInstance.SearchItemsByKeyword(args.keyword)
                return recordedItems
            }
        },
        getAllowedCategoriesIDs: {
            type: new GraphQLList(GraphQLString),
            resolve() {
                const stagingServiceInstance = Container.get(StagingService)
                const allowedIds = stagingServiceInstance.GetAllowedCategoriesIds()
                return allowedIds
            }
        }
    }
})

export default StageQueryType