import { IMLItemInputDTO } from './IMLItem'
import { IAmazonMiniItem } from './IAmazonItem'

export interface IStagingItem {
    _id?: string
    published_by: string
    allow_sync?: boolean
    ml_data: IMLItemInputDTO
    ml_id?: string
    amazon_data: IAmazonMiniItem
    createdAt?: Date
    updatedAt?: Date
}

export interface IItemDeletedInformation {
    ok: number
    n: number
    deletedCount: number
}