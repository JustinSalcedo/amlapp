import { IUser } from '../interfaces/IUser'
import mongoose from 'mongoose'

const User = new mongoose.Schema(
    {
        name: {
          type: String,
          required: [true, 'Please enter a full name'],
          index: true,
        },
    
        email: {
          type: String,
          lowercase: true,
          unique: true,
          index: true,
        },
    
        password: String,
    
        salt: String,
    
        role: {
          type: String,
          default: 'user'
        },

        redirect_urls: {
          ml_access: {
            type: String
          },

          rapid_access: {
            type: String
          }
        },

        config: {
          ml_token: {
            access_token: {
              type: String
            },
            token_type: {
              type: String
            },
            expires_in: {
              type: Number
            },
            scope: {
              type: String
            },
            user_id: {
              type: Number
            },
            refresh_token: {
              type: String
            }
          },

          ml_access_date: {
            type: Date
          },

          rapidapi_key: {
            type: String
          }
        },

        ml_account: {
          type: Object
        }
    },
    { timestamps: true }
)

export default mongoose.model<IUser & mongoose.Document>('User', User)