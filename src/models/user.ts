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

          last_item_sync_date: {
            type: Date,
            default: new Date
          },

          ml_access_date: {
            type: Date
          },

          rapidapi_key: {
            type: String
          }
        },

        custom_parameters: {
          type: {
            profit_margin: {
              type: Number,
              required: true
            },
  
            is_profit_percentage: {
              type: Boolean,
              required: true
            },
  
            default_quantity: {
              type: Number,
              required: true,
            },

            buying_mode: {
              type: String,
              required: true
            },

            item_condition: {
              type: String,
              required: true
            },

            listing_type_id: {
              type: String,
              required: true
            },

            sale_terms: {
              type: [{
                id: {
                  type: String
                },

                value_name: {
                  type: String
                }
              }],
              required: true
            },

            local_currency_code: {
              type: String,
              required: true
            },

            sync_concurrency_in_hours: {
              type: Number,
              required: true,
            }
          },

          default: {
            profit_margin: 0,
            is_profit_percentage: false,
            default_quantity: 10,
            buying_mode: 'buy_it_now',
            item_condition: 'new',
            listing_type_id: 'gold_special',
            sale_terms: [
              {
                id: 'WARRANTY_TYPE',
                value_name: 'Garant??a del vendedor'
              },

              {
                id: 'WARRANTY_TIME',
                value_name: '90 d??as'
              }
            ],
            local_currency_code: 'MXN',
            sync_concurrency_in_hours: 24
          }
        },

        ml_account: {
          type: Object
        },

        items: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Item'
        }]
    },
    { timestamps: true }
)

export default mongoose.model<IUser & mongoose.Document>('User', User)