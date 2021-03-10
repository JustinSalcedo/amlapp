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

const SearchProductDetailsType = new GraphQLObjectType({
    name: 'SearchProductDetailsType',
    fields: {
        productDescription: { type: GraphQLString },
        asin: { type: GraphQLString },
        countReview: { type: GraphQLInt },
        imgUrl: { type: GraphQLString }
    }
})

const SearchResultsType = new GraphQLObjectType({
    name: 'SearchResultsType',
    fields: {
        responseStatus: { type: GraphQLString },
        responseMessage: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        domainCode: { type: GraphQLString },
        keyword: { type: GraphQLString },
        numberOfProducts: { type: GraphQLInt },
        foundProducts: { type: new GraphQLList(GraphQLString) },
        searchProductDetails: { type: new GraphQLList(SearchProductDetailsType) }
    }
})

const SearchOptionsInputType = new GraphQLInputObjectType({
    name: 'SearchOptionsInputType',
    fields: {
        keyword: { type: new GraphQLNonNull(GraphQLString) },
        sortBy: { type: GraphQLString },
        page: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

const CurrencyType = new GraphQLObjectType({
    name: 'CurrencyType',
    fields: {
        code: { type: GraphQLString },
        symbol: { type: GraphQLString }
    }
})

const MainImageType = new GraphQLObjectType({
    name: 'MainImageType',
    fields: {
        imageResolution: { type: GraphQLString },
        imageUrl: { type: GraphQLString }
    }
})

const ProductDetailsType = new GraphQLObjectType({
    name: 'ProductDetailsType',
    fields: {
        name: { type: GraphQLString },
        value: { type: GraphQLString }
    }
})

const ProductDetailsInputType = new GraphQLInputObjectType({
    name: 'ProductDetailsInputType',
    fields: {
        name: { type: GraphQLString },
        value: { type: GraphQLString }
    }
})

const ReviewType = new GraphQLObjectType({
    name: 'ReviewType',
    fields: {
        text: { type: GraphQLString },
        date: { type: GraphQLString },
        rating: { type: GraphQLString },
        title: { type: GraphQLString },
        userName: { type: GraphQLString },
        url: { type: GraphQLString }
    }
})

const AmazonValueType = new GraphQLObjectType({
    name: 'AmazonValueType',
    fields: {
        value: { type: GraphQLString },
        dpUrl: { type: GraphQLString },
        selected: { type: GraphQLBoolean },
        available: { type: GraphQLBoolean }
    }
})

const AmazonValueInputType = new GraphQLInputObjectType({
    name: 'AmazonValueInputType',
    fields: {
        value: { type: GraphQLString },
        dpUrl: { type: GraphQLString },
        selected: { type: GraphQLBoolean },
        available: { type: GraphQLBoolean }
    }
})

const AmazonVariationType = new GraphQLObjectType({
    name: 'AmazonVarationType',
    fields: {
        variationName: { type: GraphQLString },
        values: { type: new GraphQLList(AmazonValueType) }
    }
})

const AmazonVariationInputType = new GraphQLInputObjectType({
    name: 'AmazonVarationInputType',
    fields: {
        variationName: { type: GraphQLString },
        values: { type: new GraphQLList(AmazonValueInputType) }
    }
})

const ItemDetailsType = new GraphQLObjectType({
    name: 'ItemDetailsType',
    fields: {
        acKeywordLink: { type: GraphQLString },
        addon: { type: GraphQLBoolean },
        answeredQuestions: { type: GraphQLInt },
        asin: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLString) },
        countReview: { type: GraphQLInt },
        currency: { type: CurrencyType },
        dealPrice: { type: GraphQLFloat },
        deliveryMessage: { type: GraphQLString },
        features: { type: new GraphQLList(GraphQLString) },
        fulfilledBy: { type: GraphQLString },
        imageUrlList: { type: new GraphQLList(GraphQLString) },
        mainImage: { type: MainImageType },
        manufacturer: { type: GraphQLString },
        minimalQuantity: { type: GraphQLString },
        pantry: { type: GraphQLBoolean },
        price: { type: GraphQLFloat },
        priceSaving: { type: GraphQLString },
        priceShippingInformation: { type: GraphQLString },
        prime: { type: GraphQLBoolean },
        productDescription: { type: GraphQLString },
        productDetails: { type: new GraphQLList(ProductDetailsType) },
        productRating: { type: GraphQLString },
        productTitle: { type: GraphQLString },
        rentPrice: { type: GraphQLFloat },
        responseMessage: { type: GraphQLString },
        responseStatus: { type: GraphQLString },
        retailPrice: { type: GraphQLFloat },
        retailPriceRent: { type: GraphQLFloat },
        reviews: { type: new GraphQLList(ReviewType) },
        salePrice: { type: GraphQLFloat },
        shippingPrice: { type: GraphQLFloat },
        soldBy: { type: GraphQLString },
        usedPrice: { type: GraphQLFloat },
        variations: { type: new GraphQLList(AmazonVariationType) },
        warehouseAvailability: { type: GraphQLString }
    }
})

const CurrencyInputType = new GraphQLInputObjectType({
    name: 'CurrencyInputType',
    fields: {
        code: { type: GraphQLString },
        symbol: { type: GraphQLString }
    }
})

const ItemMinimumDetailsInputType = new GraphQLInputObjectType({
    name: 'ItemMinimumDetailsInputType',
    fields: {
        asin: { type: new GraphQLNonNull(GraphQLString) },
        currency: { type: CurrencyInputType },
        features: { type: new GraphQLList(GraphQLString) },
        imageUrlList: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        productDescription: { type: new GraphQLNonNull(GraphQLString) },
        productDetails: { type: new GraphQLList(ProductDetailsInputType) },
        productTitle: { type: new GraphQLNonNull(GraphQLString )},
        variations: { type: new GraphQLList(AmazonVariationInputType) },
        warehouseAvailability: { type: GraphQLNonNull(GraphQLString) }
    }
})

const ItemMinimumDetailsType = new GraphQLObjectType({
    name: 'ItemMinimumDetailsType',
    fields: {
        asin: { type: GraphQLString },
        currency: { type: CurrencyType },
        features: { type: new GraphQLList(GraphQLString) },
        imageUrlList: { type: new GraphQLList(GraphQLString) },
        price: { type: GraphQLFloat },
        productDescription: { type: GraphQLString },
        productDetails: { type: new GraphQLList(ProductDetailsType) },
        productTitle: { type: GraphQLString},
        variations: { type: new GraphQLList(AmazonVariationType) },
        warehouseAvailability: { type: GraphQLString }
    }
})

export {
    SearchResultsType,
    SearchOptionsInputType,
    ItemDetailsType,
    ItemMinimumDetailsType,
    ItemMinimumDetailsInputType
}