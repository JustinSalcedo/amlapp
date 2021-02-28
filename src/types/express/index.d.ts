import { Document, Model } from 'mongoose'
import { IStagingItem } from '../../interfaces/IStagingItem'
import { IUser } from '../../interfaces/IUser'

declare global {
    namespace Express {
        export interface Request {
            currentUser: IUser & Document
            token: any
        }
    }

    namespace Models {
        export type UserModel = Model<IUser & Document>
        export type ItemModel = Model<IStagingItem & Document>
            & { fuzzySearch: (query: string) => Promise<(IStagingItem & Document)[]> }
    }
}