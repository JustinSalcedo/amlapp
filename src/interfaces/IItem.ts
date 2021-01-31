interface attribute {
    id: string,
    value_name: string
}

interface location {
    id: string,
    name: string
}

export interface IItemInputDTO {
    title: string,
    category_id: string,
    price: number,
    currency_id: string,
    available_quantity: number,
    buying_mode: string,
    condition: string,
    listing_type_id: string,
    description: {
        plain_text: string
    },
    video_id: string,
    tags: string[],
    sale_terms: attribute[],
    pictures: {
        source: string
    }[],
    attributes: attribute[],
}

export interface IItem {
    id: string,
    site_id: string,
    title: string,
    subtitle: string | null,
    seller_id: number,
    category_id: string,
    official_store_id: string | null,
    price: number,
    base_price: number,
    original_price: string | null,
    inventory_id: string | null,
    currency_id: string,
    initial_quantity: number,
    available_quantity: number,
    sold_quantity: number,
    sale_terms: {
        id: string,
        name: string,
        value_id: string,
        value_name: string,
        value_struct: any,
        values: {
            id: string | null,
            name: string,
            struct: {
                number: number,
                unit: string
            } | null
        }
    },
    buying_mode: string,
    listing_type_id: string,
    start_time: string,
    stop_time: string,
    end_time: string,
    expiration_time: string,
    condition: string,
    permalink: string,
    pictures: {
        id: string,
        url: string,
        secure_url: string,
        size: string,
        max_size: string,
        quality: string
    },
    video_id: string | null,
    descriptions: {
        id: string
    }[],
    accepts_mercadopago: boolean,
    non_mercado_pago_payment_methods: any[],
    shipping: {
        mode: string,
        local_pick_up: boolean,
        free_shipping: boolean,
        methods: any[],
        dimensions: any,
        tags: any[],
        logistic_type: string,
        store_pick_up: boolean
    },
    international_delivery_mode: string,
    seller_address: {
        id: number,
        comment: string,
        address_line: string,
        zip_code: string,
        city: location,
        state: location,
        country: location,
        latitude: number,
        longitude: number,
        search_location: {
            neighborhood: location,
            city: location,
            state: location
        }
    },
    seller_contact: any,
    location: {},
    geolocation: {
        latitude: number,
        longitude: number
    },
    coverage_areas: any[],
    attributes: {
        id: string,
        name: string,
        value_id: string,
        value_name: string,
        value_struct: any,
        values: any,
        attribute_group_id: string,
        attribute_group_name: string
    },
    warnings: any[],
    listing_source: string,
    variations: any[],
    thumbnail: string,
    secure_thumbnail: string,
    status: string,
    sub_status: any[],
    tags: string[],
    warranty: string,
    catalog_product_id: any,
    domain_id: any,
    seller_custom_field: any,
    parent_item_id: any,
    differential_pricing: any,
    deal_ids: any[],
    automatic_relist: boolean,
    date_create: string,
    last_updated: string,
    health: any,
    catalog_listing: boolean,
    item_relations: any[]
}