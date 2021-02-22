import { IMLItemInputDTO } from '../interfaces/IMLItem'

export interface IStagingItem {
    ml_data: IMLItemInputDTO
    createdAt: Date
    updatedAt: Date
}