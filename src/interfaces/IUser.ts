import IMLToken from './IMLToken'

export interface ICustomParameters {
    profit_margin: number
    default_quantity: number
    is_profit_percentage: boolean
    buying_mode: string
    item_condition: string
    listing_type_id: string
    sale_terms: {
        id: string,
        value_name: string
    }[]
    local_currency_code: string
    sync_concurrency_in_hours: number
}

export interface IUser {
    _id?: string
    role?: string
    name: string
    email: string
    password: string
    salt: string
    redirect_urls?: {
        ml_access: string
        rapid_access: string
    }
    config?: {
        ml_token: IMLToken
        ml_access_date: Date
        rapidapi_key: string
        last_item_sync_date: Date
    }
    custom_parameters?: ICustomParameters
    ml_account?: any
    createdAt?: Date
    updatedAt?: Date
    items?: string[]
}

export interface IUserInputDTO {
    name: string
    email: string
    password: string
}

export interface IUserConfigStatus {
    configuration_complete: boolean
    mercado_libre_authorization: boolean
    rapidapi_key_added: boolean
}