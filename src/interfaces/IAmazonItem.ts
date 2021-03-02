interface value {
    value: string
    dpUrl: string
    selected: boolean
    available: boolean
}

interface variation {
    variationName: string
    values: value[]
}

export interface IAmazonItem {
    acKeywordLink: string | null
    addon: boolean
    answeredQuestions: number
    asin: string
    categories: string[]
    countReview: number
    currency: {
        code: string
        symbol: string
    } | null
    dealPrice: number   //// float
    deliveryMessage: string
    features: string[]
    fulfilledBy: string
    imageUrlList: string[]
    mainImage: {
        imageResolution: string
        imageUrl: string
    }
    manufacturer: string
    minimalQuantity: string | null
    pantry: boolean
    price: number   //// float
    // priceRange: any | null 
    priceSaving: string | null
    priceShippingInformation: string
    prime: boolean
    productDescription: string
    productDetails: {
        name: string
        value: string
    }[]
    productRating: string | null
    // productSpecification: any[]
    productTitle: string
    rentPrice: number
    responseMessage: string
    responseStatus: string
    retailPrice: number //// float
    retailPriceRent: number
    reviews: {
        text: string
        date: string
        rating: string
        title: string
        userName: string
        url: string
    }[]
    salePrice: number   //// float
    shippingPrice: number
    // sizeSelection: any[]
    soldBy: string
    usedPrice: number
    variations: variation[]
    warehouseAvailability: string
}

export interface IAmazonMiniItem {
    asin: string
    productTitle: string
    price: number
    variations: variation[]
    currency: {
        code: string
        symbol: string
    } | null
    warehouseAvailability: string
    productDescription: string
    productDetails: {
        name: string
        value: string
    }[]
    features: string[]
    imageUrlList: string[]
}