import mongoose from 'mongoose'
import mongooseFuzzySearching from 'mongoose-fuzzy-searching'
import { IStagingItem } from '../interfaces/IStagingItem'

const Item = new mongoose.Schema(
    {
        published_by: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: 'User'
        },

        allow_sync: {
            type: Boolean,
            required: true,
            default: true
        },

        ml_id: {
            type: String
        },

        ml_data: {
            title: {
                type: String,
                required: true
            },

            subtitle: {
                type: String
            },

            category_id:{
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            variations: {
                type: [{
                    attribute_combinations: {
                        type: [{
                            name: {
                                type: String,
                                required: true
                            },

                            value_id: {
                                type: String
                            },

                            value_name: {
                                type: String
                            }
                        }]
                    },

                    price: {
                        type: Number,
                        required: true
                    },

                    available_quantity: {
                        type: Number,
                        required: true
                    },

                    attributes: {
                        type: [{
                            id: {
                                type: String,
                                required: true
                            },

                            value_name: {
                                type: String,
                                required: true
                            }
                        }]
                    },

                    sold_quantity: {
                        type: Number,
                        required: true
                    },

                    seller_custom_field: {
                        type: String
                    },

                    picture_ids: {
                        type: [String]
                    }
                }]
            },

            official_store_id: {
                type: Number
            },

            currency_id: {
                type: String,
                required: true
            },

            available_quantity: {
                type: Number,
                required: true
            },

            buying_mode: {
                type: String,
                required: true
            },

            condition: {
                type: String,
                required: true
            },

            listing_type_id: {
                type: String,
                required: true
            },

            description: {
                plain_text: {
                    type: String
                }
            },

            video_id: {
                type: String,
                default: 'YOUTUBE_ID_HERE'
            },

            tags: {
                type: [String]
            },

            sale_terms: {
                type: [{
                    id: {
                        type: String,
                        required: true
                    },

                    value_name: {
                        type: String,
                        required: true
                    }
                }]
            },

            pictures: {
                type: [{
                    source: {
                        type: String
                    }
                }]
            },

            attributes:{
                type: [{
                    id: {
                        type: String,
                        required: true
                    },

                    value_name: {
                        type: String,
                        required: true
                    }
                }]
            }
        },

        amazon_data: {
            acKeywordLink: {
                type: String
            },

            addon: {
                type: Boolean
            },

            answeredQuestions: {
                type: Number
            },

            asin: {
                type: String,
                required: true,
                index: true,
                unique: true
            },

            categories: {
                type: [String],
                required: true
            },

            countReview: {
                type: Number
            },

            currency: {
                code: {
                    type: String
                },

                symbol: {
                    type: String
                }
            },

            dealPrice: {
                type: Number
            },

            deliveryMessage: {
                type: String
            },

            features: {
                type: [String]
            },

            fulfilledBy: {
                type: String
            },

            imageUrlList: {
                type: [String]
            },

            mainImage: {
                imageResolution: {
                    type: String
                },

                imageUrl: {
                    type: String
                }
            },

            manufacturer: {
                type: String
            },

            minimalQuantity: {
                type: String
            },

            pantry: {
                type: Boolean
            },

            price: {
                type: Number,
                required: true
            },

            priceSaving: {
                type: String
            },

            priceShippingInformation: {
                type: String
            },

            prime: {
                type: Boolean
            },

            productDescription: {
                type: String,
                required: true
            },

            productDetails: {
                type: [{
                    name: {
                        type: String
                    },

                    value: {
                        type: String
                    }
                }]
            },

            productRating: {
                type: String
            },

            productTitle: {
                type: String,
                required: true
            },

            rentPrice: {
                type: Number
            },

            responseMessage: {
                type: String
            },

            responseStatus: {
                type: String
            },

            retailPrice: {
                type: Number
            },

            retailPriceRent: {
                type: Number
            },

            reviews: {
                type: [{
                    text: {
                        type: String
                    },

                    date: {
                        type: String
                    },

                    rating: {
                        type: String
                    },

                    title: {
                        type: String
                    },

                    userName: {
                        type: String
                    },

                    url: {
                        type: String
                    }
                }]
            },

            salePrice: {
                type: Number
            },

            shippingPrice: {
                type: Number
            },

            soldBy: {
                type: String
            },

            usedPrice: {
                type: Number
            },

            varations: {
                type: [{
                    variationName: {
                        type: String
                    },

                    values: {
                        type: [{
                            value: {
                                type: String
                            },

                            dpUrl: {
                                type: String
                            },

                            selected: {
                                type: Boolean
                            },

                            available: {
                                type: Boolean
                            }
                        }]
                    }
                }]
            },

            warehouseAvailability: {
                type: String
            }
        }
    },
    { timestamps: true }
)

Item.plugin(mongooseFuzzySearching, { fields: ['ml_data.title', 'amazon_data.productTitle'] })

export default mongoose.model<IStagingItem & mongoose.Document>('Item', Item)