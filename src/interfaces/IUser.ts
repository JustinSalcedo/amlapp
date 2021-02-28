import { IExchangeRates } from './IExchangeRates'
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
}

export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    salt: string
    redirect_urls: {
        ml_access: string
        rapid_access: string
    }
    config: {
        ml_token: IMLToken
        ml_access_date: Date
        rapidapi_key: string
        exchange_rates: IExchangeRates
    }
    custom_parameters: ICustomParameters
    ml_account: any
    createdAt: Date
    updatedAt: Date
    items: string[]
}

export interface IUserInputDTO {
    name: string
    email: string
    password: string
}