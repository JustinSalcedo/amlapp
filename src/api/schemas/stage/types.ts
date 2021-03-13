import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInputObjectType
} from 'graphql'

import {
    ItemDataType
} from '../ml/types'

import {
    ItemMinimumDetailsType
} from '../amazon/types'

const StagedItemType = new GraphQLObjectType({
    name: 'StagedItem',
    fields: {
        _id: { type: GraphQLString },
        published_by: { type: GraphQLString },
        allow_sync: { type: GraphQLBoolean },
        ml_data: { type: ItemDataType },
        ml_id: { type: GraphQLString },
        amazon_data: { type: ItemMinimumDetailsType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})

const UpdatedItemsInfoType = new GraphQLObjectType({
    name: 'UpdatedItemsInfoType',
    fields: {
        ok: { type: GraphQLInt },
        n: { type: GraphQLInt },
        nModified: { type: GraphQLInt }
    }
})

const DeletedItemsInfoType = new GraphQLObjectType({
    name: 'DeletedItemsInfoType',
    fields: {
        ok: { type: GraphQLInt },
        n: { type: GraphQLInt },
        deletedCount: { type: GraphQLInt }
    }
})

const CustomSaleTermsType = new GraphQLObjectType({
    name: 'CustomSaleTermsType',
    fields: {
        id: { type: GraphQLString },
        value_name: { type: GraphQLString }
    }
})

const CustomSaleTermsInputType = new GraphQLInputObjectType({
    name: 'CustomSaleTermsInputType',
    fields: {
        id: { type: GraphQLString },
        value_name: { type: GraphQLString }
    }
})

const CustomParametersType = new GraphQLObjectType({
    name: 'CustomParametersType',
    fields: {
        profit_margin: { type: GraphQLFloat },
        default_quantity: { type: GraphQLInt },
        is_profit_percentage: { type: GraphQLBoolean },
        buying_mode: { type: GraphQLString },
        item_condition: { type: GraphQLString },
        listing_type_id: { type: GraphQLString },
        sale_terms: { type: new GraphQLList(CustomSaleTermsType) },
        local_currency_code: { type: GraphQLString },
        sync_concurrency_in_hours: { type: GraphQLInt }
    }
})

export {
    StagedItemType,
    UpdatedItemsInfoType,
    DeletedItemsInfoType,
    CustomParametersType,
    CustomSaleTermsInputType
}