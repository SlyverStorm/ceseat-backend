import mongoose from "mongoose";
import { Types } from "mongoose";

export interface OrderDocument extends mongoose.Document {
    price: number;
    // summary: {
    //     articles: [{
    //         name: string;
    //         price: number;
    //         quantity: number;
    //     }],
    //     menus : [{
    //         name: string;
    //         price: number;
    //         quantity: number;
    //         content: [{
    //             sectionName: string;
    //             articles: [{
    //                 name: string;
    //                 price: number;
    //             }]
    //         }]
    //     }],
    // }
    summary: {
        articles: Object[],
        menus: Object[]
    }
    // restaurant: {
    //     _id: Types.ObjectId;
    //     name: string;
    //     image?: string;
    //     description?: string;
    //     address: {
    //         label: string;
    //         latitude: number;
    //         longitude: number;
    //     }
    // },
    restaurant: {
        _id: Types.ObjectId;
        name: string;
        description?: string;
        address: {
            label: string;
            latitude: number;
            longitude: number;
        }
    },
    // driver: {
    //     driverUserId: string
    //     driverStatus: Types.ObjectId;
    //     name: string;
    //     surname: string;
    //     image?: string;
    // },
    driver: Types.ObjectId | null,
    wallet: {
        cardNumber: string;
    },
    address: {
        label: string;
        latitude: number;
        longitude: number;
    },
    userId: string;
    orderStatus: Types.ObjectId;
    deletedAt?: Date | null;
}

const OrderSchema = new mongoose.Schema({
    price: {type: Number, required: true},
    summary: {
        type: Object,
        required: true,
        properties: {
            articles: [{
                type: Object,
                required: true,
            }],
            menus: [{
                type: Object,
                required: true,
            }]
        }
            //     properties: {
            //         name: {type: String, required: true},
            //         price: {type: Number, required: true},
            //         quantity: {type: Number, required: true},
            //     }
            // }],
            // Articles: [{type: Types.ObjectId, ref: "Article", required: true}],
            // menus : [{
            //     type: Object,
            //     required: true,
            //     properties: {
            //         name: {type: String, required: true},
            //         price: {type: Number, required: true},
            //         quantity: {type: Number, required: true},
            //         content: [{
            //             type: Object,
            //             required: true,
            //             properties: {
            //                 sectionName: {type: String, required: true},
            //                 articles: [{
            //                     type: Object,
            //                     required: true,
            //                     properties: {
            //                         name: {type: String, required: true},
            //                         price: {type: Number, required: true},
            //                     }
            //                 }]
            //             }
            //         }]
            //     }
            // }]
            // Menus: [{type: Types.ObjectId, ref: "Menu", required: true}]
    },
    // restaurant: {
    //     type: Object,
    //     required: true,
    //     properties: {
    //         _id: {type: Types.ObjectId, ref: "Restaurant", required: true},
    //         name: {type: String, required: true},
    //         image: {type: String, required: false, default: null},
    //         description: {type: String, required: false, default: ""},
    //         address: {
    //             type: Object,
    //             required: true,
    //             properties: {
    //                 label: {type: String, required: true},
    //                 latitude: {type: Number, required: true},
    //                 longitude: {type: Number, required: true},
    //             }
    //         }
    //     }
    // },
    restaurant: {
        type: Object,
        required: true,
        properties: {
            _id: {type: Types.ObjectId, required: true},
            name: {type: String, required: true},
            description: {type: String, required: false, default: ""},
            address: {
                type: Object,
                required: true,
                properties: {
                    label: {type: String, required: true},
                    latitude: {type: Number, required: true},
                    longitude: {type: Number, required: true},
                }
            }
        }
    },
    // driver: {
    //     type: Object,
    //     required: true,
    //     properties: {
    //         driverUserId: {type: String, required: true},
    //         driverStatus: {type: Types.ObjectId, ref: "DriverStatus", required: true},
    //         name: {type: String, required: true},
    //         surname: {type: String, required: true},
    //         image: {type: String, required: false, default: null},
    //     }
    // },
    driver: {type: Types.ObjectId, ref: "DriverStatus", required: false, default: null},
    wallet: {
        type: Object,
        required: true,
        properties: {
            cardNumber: {type: String, required: true},
        }
    },
    address: {
        type: Object,
        required: true,
        properties: {
            label: {type: String, required: true},
            latitude: {type: Number, required: true},
            longitude: {type: Number, required: true},
        }
    },
    userId: {type: String, required: true},
    orderStatus: {type: Types.ObjectId, ref: "OrderStatus", required: true, default: null},
    deletedAt: {type: Date, required: false, default: null},
},{
    timestamps:true
});

const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);

export default OrderModel;