import { Document, Model } from 'mongoose'
import { IUser } from '../../interfaces/IUser'
import { IItem } from '../../interfaces/IItem'

declare global {
    namespace Express {
        export interface Request {
            currentUser: IUser & Document
        }
    }

    namespace Models {
        export type UserModel = Model<IUser & Document>
    }
}