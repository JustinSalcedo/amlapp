interface productDetail {
    productDescription: string
    asin: string
    countReview: number
    imgUrl: string
}

export interface IAmazonSearchResults {
    responseStatus: string
    responseMessage: string
    sortBy: string
    domainCode: string
    keyword: string
    numberOfProducts: number
    foundProducts: string[]
    searchProductDetails: productDetail[]
}

export interface IAmazonSearchOptions {
    keyword: string
    sortBy: string | null
        ////    'relevanceblender'
        ////    'price-asc-rank'
        ////    'price-desc-rank'
        ////    'review-rank'
        ////    'date-desc-rank'
    page: number    //// int
}