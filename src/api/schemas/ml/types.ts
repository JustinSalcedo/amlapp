import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLScalarType
} from 'graphql'

const StructType = new GraphQLObjectType({
    name: 'StructType',
    fields: {
        number: { type: GraphQLFloat },
        unit: { type: GraphQLString }
    }
})

const SubValueType = new GraphQLObjectType({
    name: 'SubValueType',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        struct: { type: StructType }
    }
})

const MLValueType = new GraphQLObjectType({
    name: 'MLValueType',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        value_id: { type: GraphQLString },
        value_name: { type: GraphQLString },
        value_struct: { type: StructType },
        values: { type: new GraphQLList(SubValueType) }
    }
})

const MLVariationType = new GraphQLObjectType({
    name: 'MLVariationType',
    fields: {
        id: { type: GraphQLInt },
        price: { type: GraphQLInt },
        attribute_combinations: { type: new GraphQLList(MLValueType) },
        available_quantity: { type: GraphQLInt },
        sold_quantity: { type: GraphQLInt },
        sale_terms: { type: new GraphQLList(MLValueType) },
        picture_ids: { type: new GraphQLList(GraphQLString) },
        seller_custom_field: { type: GraphQLString },
        catalog_product_id: { type: GraphQLString }
    }
})

const GeoLocationType = new GraphQLObjectType({
    name: 'GeoLocationType',
    fields: {
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat }
    }
})

const LocationType = new GraphQLObjectType({
    name: 'LocationType',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString }
    }
})

const SearchLocationType = new GraphQLObjectType({
    name: 'SearchLocationType',
    fields: {
        neighborhood: { type: LocationType },
        city: { type: LocationType },
        state: { type: LocationType }
    }
})

const AddressType = new GraphQLObjectType({
    name: 'AddressType',
    fields: {
        city: { type: LocationType },
        state: { type: LocationType },
        country: { type: LocationType },
        search_location: { type: SearchLocationType },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
        id: { type: GraphQLInt }
    }
})

const FreeMethodRule = new GraphQLObjectType({
    name: 'FreeMethodRuleType',
    fields: {
        default: { type: GraphQLBoolean },
        free_mode: { type: GraphQLString },
        free_shipping_flag: { type: GraphQLBoolean },
        value: { type: GraphQLString }
    }
})

const ShippingFreeMethod = new GraphQLObjectType({
    name: 'ShippingFreeMethodType',
    fields: {
        id: { type: GraphQLInt },
        rule: { type: FreeMethodRule }
    }
})

const ShippingType = new GraphQLObjectType({
    name: 'ShippingType',
    fields: {
        mode: { type: GraphQLString },
        free_methods: { type: new GraphQLList(ShippingFreeMethod) },
        tags: { type: new GraphQLList(GraphQLString) },
        dimensions: { type: GraphQLString },
        local_pick_up: { type: GraphQLBoolean },
        free_shipping: { type: GraphQLBoolean },
        logistic_type: { type: GraphQLString },
        store_pick_up: { type: GraphQLBoolean }
    }
})

const IDStringType = new GraphQLObjectType({
    name: 'IDStringType',
    fields: {
        id: { type: GraphQLString }
    }
})

const PictureType = new GraphQLObjectType({
    name: 'PictureType',
    fields: {
        id: { type: GraphQLString },
        url: { type: GraphQLString },
        secure_url: { type: GraphQLString },
        size: { type: GraphQLString },
        max_size: { type: GraphQLString },
        quality: { type: GraphQLString }
    }
})

const AttributeType = new GraphQLObjectType({
    name: 'AttributeType',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        value_id: { type: GraphQLString },
        value_name: { type: GraphQLString },
        value_struct: { type: StructType },
        values: { type: new GraphQLList(SubValueType) },
        attribute_group_id: { type: GraphQLString },
        attribute_group_name: { type: GraphQLString }
    }
})

const ItemType = new GraphQLObjectType({
    name: 'ItemType',
    fields: {
        id: { type: GraphQLString },
        site_id: { type: GraphQLString },
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        seller_id: { type: GraphQLInt },
        category_id: { type: GraphQLString },
        official_store_id: { type: GraphQLInt },
        price: { type: GraphQLInt },
        base_price: { type: GraphQLInt },
        original_price: { type: GraphQLInt },
        currency_id: { type: GraphQLString },
        initial_quantity: { type: GraphQLInt },
        available_quantity: { type: GraphQLInt },
        sold_quantity: { type: GraphQLInt },
        sale_terms: { type: new GraphQLList(MLValueType) },
        buying_mode: { type: GraphQLString },
        listing_type_id: { type: GraphQLString },
        start_time: { type: GraphQLString },
        stop_time: { type: GraphQLString },
        condition: { type: GraphQLString },
        permalink: { type: GraphQLString },
        thumbnail: { type: GraphQLString },
        secure_thumbnail: { type: GraphQLString },
        pictures: { type: new GraphQLList(PictureType) },
        video_id: { type: GraphQLString },
        descriptions: { type: new GraphQLList(IDStringType) },
        accepts_mercadopago: {type: GraphQLBoolean },
        // non_mercado_pago_payment_methods: { type: new GraphQLList() },
        shipping: { type: ShippingType },
        international_delivery_mode: { type: GraphQLString },
        seller_address: { type: AddressType },
        seller_contact: { type: GraphQLString },
        location: { type: LocationType },
        geolocation: { type: GeoLocationType },
        // coverage_areas: { type: new GraphQLList(GraphQLString) },
        attributes: { type: new GraphQLList(AttributeType) },
        // warnings: { type: new GraphQLList(GraphQLString) },
        listing_source: { type: GraphQLString },
        variations: { type: new GraphQLList(MLVariationType) },
        status: { type: GraphQLString },
        sub_status: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        warranty: { type: GraphQLString },
        catalog_product_id: { type: GraphQLString },
        domain_id: { type: GraphQLString },
        parent_items_id: { type: GraphQLString },
        differential_pricing: { type: GraphQLString },
        deal_ids: { type: new GraphQLList(GraphQLString) },
        automatic_relist: { type: GraphQLBoolean },
        date_created: { type: GraphQLString },
        last_updated: { type: GraphQLString },
        health: { type: GraphQLFloat },
        catalog_listing: { type: GraphQLBoolean }
    }
})

const SourceDataInputType = new GraphQLInputObjectType({
    name: 'SourceDataInputType',
    fields: {
        source: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const SourceDataType = new GraphQLObjectType({
    name: 'SourceDataType',
    fields: {
        source: { type: GraphQLString }
    }
})

const AttributeDataInputType = new GraphQLInputObjectType({
    name: 'AttributeDataInputType',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        value_name: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const AttributeDataType = new GraphQLObjectType({
    name: 'AttributeDataType',
    fields: {
        id: { type: GraphQLString },
        value_name: { type: GraphQLString }
    }
})

const DescriptionDataInputType = new GraphQLInputObjectType({
    name: 'DescriptionDataInputType',
    fields: {
        plain_text: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const DescriptionDataType = new GraphQLObjectType({
    name: 'DescriptionDataType',
    fields: {
        plain_text: { type: GraphQLString }
    }
})

const AttributeCombinationDataInputType = new GraphQLInputObjectType({
    name: 'AttributeCombinationDataInputType',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        value_id: { type: GraphQLString },
        value_name: { type: GraphQLString }
    }
})

const AttributeCombinationDataType = new GraphQLObjectType({
    name: 'AttributeCombinationDataType',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        value_id: { type: GraphQLString },
        value_name: { type: GraphQLString }
    }
})

const MLVariationDataInputType = new GraphQLInputObjectType({
    name: 'MLVariationInputType',
    fields: {
        attribute_combinations: { type: new GraphQLNonNull(new GraphQLList(AttributeCombinationDataInputType)) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        available_quantity: { type: new GraphQLNonNull(GraphQLInt) },
        attributes: { type: new GraphQLNonNull(new GraphQLList(AttributeDataInputType)) },
        sold_quantity: { type: new GraphQLNonNull(GraphQLInt) },
        seller_custom_field: { type: GraphQLString },
        picture_ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    }
})

const MLVariationDataType = new GraphQLObjectType({
    name: 'MLVariationDataType',
    fields: {
        attribute_combinations: { type: new GraphQLList(AttributeCombinationDataType) },
        price: { type: GraphQLInt },
        available_quantity: { type: GraphQLInt },
        attributes: { type: new GraphQLList(AttributeDataType) },
        sold_quantity: { type: GraphQLInt },
        seller_custom_field: { type: GraphQLString },
        picture_ids: { type: new GraphQLList(GraphQLString) },
    }
})

const ItemDataInputType = new GraphQLInputObjectType({
    name: 'ItemDataInputType',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        subtitle: { type: GraphQLString },
        category_id: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        variations: { type: new GraphQLList(MLVariationDataInputType) },
        official_store_id: { type: GraphQLInt },
        currency_id: { type: new GraphQLNonNull(GraphQLString) },
        available_quantity: { type: new GraphQLNonNull(GraphQLInt) },
        buying_mode: { type: new GraphQLNonNull(GraphQLString) },
        condition: { type: new GraphQLNonNull(GraphQLString) },
        listing_type_id: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(DescriptionDataInputType) },
        video_id: { type: new GraphQLNonNull(GraphQLString), defaultValue: 'YOUTUBE_ID_HERE' },
        sale_terms: { type: new GraphQLNonNull(new GraphQLList(AttributeDataInputType)) },
        pictures: { type: new GraphQLNonNull(new GraphQLList(SourceDataInputType)) },
        attributes: { type: new GraphQLNonNull(new GraphQLList(AttributeDataInputType)) }
    }
})

const ItemDataOptionalInputType = new GraphQLInputObjectType({
    name: 'ItemDataOptionalInputType',
    fields: {
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        category_id: { type: GraphQLString },
        price: { type: GraphQLInt },
        variations: { type: new GraphQLList(MLVariationDataInputType) },
        official_store_id: { type: GraphQLInt },
        currency_id: { type: GraphQLString },
        available_quantity: { type: GraphQLInt },
        buying_mode: { type: GraphQLString },
        condition: { type: GraphQLString },
        listing_type_id: { type: GraphQLString },
        description: { type: DescriptionDataInputType },
        video_id: { type: GraphQLString},
        sale_terms: { type: new GraphQLList(AttributeDataInputType) },
        pictures: { type: new GraphQLList(SourceDataInputType) },
        attributes: { type: new GraphQLList(AttributeDataInputType) }
    }
})

const ExtendedFilterIdType = new GraphQLObjectType({
    name: 'ExtendedFilterIdType',
    fields: {
        id: { type: GraphQLString },
        field: { type: GraphQLString },
        missing: { type: GraphQLString },
        order: { type: GraphQLString },
        name: { type: GraphQLString }
    }
})

const ExtendedFilterType = new GraphQLObjectType({
    name: 'ExtendedFilterType',
    fields: {
        id: { type: ExtendedFilterIdType }
    }
})

const FilterType = new GraphQLObjectType({
    name: 'FilterType',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString }
    }
})

const PagingType = new GraphQLObjectType({
    name: 'PagingType',
    fields: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        total: { type: GraphQLInt }
    }
})

const SellerItemsIDsType = new GraphQLObjectType({
    name: 'SellerItemsIDsType',
    fields: {
        seller_id: { type: GraphQLString },
        query: { type: GraphQLString },
        paging: { type: PagingType },
        results: { type: new GraphQLList(GraphQLString) },
        orders: { type: FilterType },
        available_orders: { type: ExtendedFilterType }
    }
})

const ItemDataType = new GraphQLObjectType({
    name: 'ItemDataType',
    fields: {
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        category_id: { type: GraphQLString },
        price: { type: GraphQLInt },
        variations: { type: new GraphQLList(MLVariationDataType) },
        official_store_id: { type: GraphQLInt },
        currency_id: { type: GraphQLString },
        available_quantity: { type: GraphQLInt },
        buying_mode: { type: GraphQLString },
        condition: { type: GraphQLString },
        listing_type_id: { type: GraphQLString },
        description: { type: DescriptionDataType },
        video_id: { type: GraphQLString},
        sale_terms: { type: new GraphQLList(AttributeDataType) },
        pictures: { type: new GraphQLList(SourceDataType) },
        attributes: { type: new GraphQLList(AttributeDataType) }
    }
})

export {
    ItemType,
    ItemDataInputType,
    ItemDataOptionalInputType,
    ItemDataType,
    SellerItemsIDsType
}