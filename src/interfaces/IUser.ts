import IMLToken from './IMLToken'

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
    }
    ml_account: any
}

export interface IUserInputDTO {
    name: string
    email: string
    password: string
}