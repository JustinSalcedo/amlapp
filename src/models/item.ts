import mongoose from 'mongoose'
import { IStagingItem } from '../interfaces/IStagingItem'

const Item = new mongoose.Schema(
    {
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
        }
    },
    { timestamps: true }
)

export default mongoose.model<IStagingItem & mongoose.Document>('Item', Item)