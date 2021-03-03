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
    CustomParametersType,
    CustomSaleTermsInputType,
    DeletedItemsInfoType,
    StagedItemType
} from './types'

import {
    ItemMinimumDetailsInputType
} from '../amazon/types'

import {
    ItemDataOptionalInputType
} from '../ml/types'

const StageMutationType = new GraphQLObjectType ({
    name: 'StageMutationType',
    fields: {
        stageItems: {
            type: new GraphQLList(StagedItemType),
            args: {
                amazon_items: { type: new GraphQLNonNull(new GraphQLList(ItemMinimumDetailsInputType)) }
            },
            async resolve(parentObj, args, context) {
                const stagingServiceInstance = Container.get(StagingService)
                const stagedItems = await stagingServiceInstance.StageItems(context.currentUser, args.amazon_items)
                return stagedItems
            }
        },
        autoStageItemsByASIN: {
            type: new GraphQLList(StagedItemType),
            args: {
                asins: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            async resolve(parentObj, args, context) {
                const stagingServiceInstance = Container.get(StagingService)
                const stagedItems = await stagingServiceInstance.AutoStageItemsByASIN(context.currentUser, args.asins)
                return stagedItems
            } 
        },
        updateMLInputDataByID: {
            type: StagedItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                ml_data: { type: new GraphQLNonNull(ItemDataOptionalInputType) }
            },
            async resolve(parentObj, args) {
                const stagingServiceInstance = Container.get(StagingService)
                const updatedItem = await stagingServiceInstance.UpdateMLInputData({ _id: args.id }, args.ml_data)
                return updatedItem
            }
        },
        deleteItemsByID: {
            type: DeletedItemsInfoType,
            args: {
                ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            async resolve(parentObj, args, context) {
                const stagingServiceInstance = Container.get(StagingService)
                const deletedItemsInfo = await stagingServiceInstance.DeleteItemsByID(context.currentUser, args.ids)
                return deletedItemsInfo
            }
        },
        setCustomParameters: {
            type: CustomParametersType,
            args: {
                profit_margin: { type: GraphQLFloat },
                default_quantity: { type: GraphQLInt },
                is_profit_percentage: { type: GraphQLBoolean },
                buying_mode: { type: GraphQLString },
                item_condition: { type: GraphQLString },
                listing_type_id: { type: GraphQLString },
                sale_terms: { type: new GraphQLList(CustomSaleTermsInputType) },
                local_currency_code: { type: GraphQLString }
            },
            async resolve(parentObj, args, context) {
                const stagingServiceInstance = Container.get(StagingService)
                const updatedParameters = await stagingServiceInstance.SetParameters(context.currentUser, args)
                return updatedParameters
            }
        }
    }
})

export default StageMutationType