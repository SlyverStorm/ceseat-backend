import { object, number, string, TypeOf, boolean, array } from "zod";

const createOrderPayload = {
    body: object({

        // price: number({
        //     required_error: "Prix requis"
        // }).min(0, "Prix doit être supérieur à 0"),

        summary: object({
            articles: array(string()),
            menus: array(string())
        }).strict(),

        restaurant: string({
            required_error: "Identifiant de restaurant requis"
        }),

        address: object({
            label: string({
                required_error: "Libellé de l'adresse requis"
            }).max(255, "Taille maximale de 255 caractères"),
            latitude: number({
                required_error: "Latitude de l'addresse requise"
            }).min(0, "Latitude doit être supérieur à 0"),
            longitude: number({
                required_error: "Longitude requise"
            }).min(0, "Longitude doit être supérieur à 0"),
        }).strict(),

        // userid: string({
        //     required_error: "Identifiant du client requis"
        // }),

    }).strict()
};

const params = {
    params: object({
        orderid: string({
            required_error: "Identifiant de commande est requis"
        })
    }).strict()
};

export const createOrderSchema = object({
    ...createOrderPayload,
})

export const getOrderSchema = object({
    ...params
})

// export const updateOrderSchema = object({
//     ...updateOrderPayload,
//     ...params
// })

// export const deleteOrderSchema = object({
//     ...params
// })

export type CreateOrderInput = TypeOf<typeof createOrderSchema>
export type GetOrderInput = TypeOf<typeof getOrderSchema>
// export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>
// export type DeleteOrderInput = TypeOf<typeof deleteOrderSchema>