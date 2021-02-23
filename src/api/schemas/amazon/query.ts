import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { Container } from 'typedi'
import SearchService from "../../../services/amazon/search"
import { IUser } from '../../../interfaces/IUser'
import { IAmazonSearchOptions } from '../../../interfaces/IAmazonSearchResults'

import { SearchResultsType, SearchOptionsInputType, ItemDetailsType } from './types'

const AmazonQueryType = new GraphQLObjectType({
    name: 'AmazonQueryType',
    fields: {
        itemsSearch: {
            type: SearchResultsType,
            args: {
                searchOptions: { type: SearchOptionsInputType }
            },
            async resolve(parentObj, args, context) {
                let options = args.searchOptions
                if (!args.searchOptions.sortBy) {
                    options = { ...options, sortBy: null }
                }

                const searchServiceInstance = Container.get(SearchService)
                const searchResults = await searchServiceInstance.SearchItemsByKeyword(context.currentUser as IUser, options as IAmazonSearchOptions)
                return searchResults
            }
        },
        itemDetailsByURL: {
            type: ItemDetailsType,
            args: {
                productUrl: { type: new GraphQLNonNull(GraphQLString) },
                merchant: { type: GraphQLString }
            },
            async resolve(parentObj, args, context) {
                let options: { productUrl: string, merchant: string | null } = {
                    productUrl: args.productUrl,
                    merchant: args.merchant ? args.merchant : null
                }

                const searchServiceInstance = Container.get(SearchService)
                const itemDetails = await searchServiceInstance.GetItemDetailsByURL(context.currentUser as IUser, options)
                return itemDetails
            }
        },
        itemDetailsByASIN: {
            type: ItemDetailsType,
            args: {
                asin: { type: new GraphQLNonNull(GraphQLString) },
                merchant: { type: GraphQLString }
            },
            async resolve(parentObj, args, context) {
                let options: { asin: string, merchant: string | null } = {
                    asin: args.asin,
                    merchant: args.merchant ? args.merchant : null
                }

                const searchServiceInstance = Container.get(SearchService)
                const itemDetails = await searchServiceInstance.GetItemDetailsByASIN(context.currentUser as IUser, options)
                return itemDetails
            }
        }
    }
})

export default AmazonQueryType