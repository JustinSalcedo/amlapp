interface extendedFilter {
    id: string 
    field: string
    missing: string
    order: string
}

interface filter {
    id: string | extendedFilter
    name: string
}

interface newfilter {
    id: string 
    field: string
    missing: string | null
    order: string | null
    name: string | null
}

export interface IMLSellerItemDTO {
    seller_id: string
    query: string | null
    paging: {
        limit: number
        offset: number
        total: number
    }
    results: string[]
    orders: filter[]
    available_orders: filter[]
}

export interface IMLSellerItem {
    seller_id: string
    query: string | null
    paging: {
        limit: number
        offset: number
        total: number
    }
    results: string[]
    orders: filter[]
    available_orders: newfilter[]
}