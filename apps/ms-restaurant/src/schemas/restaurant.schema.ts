import { object, number, string, TypeOf } from "zod";

const restaurantIdRegExp = /^restaurant_\w+/;

const createRestaurantPayload = {
    body: object({
        name: string({
            required_error: "Nom du restaurant requis"
        }).max(35, "Taille maximale de 35 caractères"),
        address: string({
            required_error: "L'adresse du restaurant est requise pour créer un nouveau restaurant"
        }).max(500),
        description: string({}).optional()
    }).strict()
};

const updateRestaurantPayload = {
    body: object({
        name: string({
            required_error: "Nom du restaurant requis"
        }).max(35, "Taille maximale de 35 caractères").optional(),
        address: string({
            required_error: "L'adresse du restaurant est requise pour créer un nouveau restaurant"
        }).max(500).optional(),
        description: string({}).optional()
    }).strict()
};

const params = {
    params: object({
        restaurantId: string({
            required_error: "Identifiant de restaurant requis"
        }).regex(restaurantIdRegExp, "Identifiant de restaurant incorrect")
    }).strict()
};

export const createRestaurantSchema = object({
    ...createRestaurantPayload
})

export const getRestaurantSchema = object({
    ...params
})

export const updateRestaurantSchema = object({
    ...updateRestaurantPayload,
    ...params
})

export const deleteRestaurantSchema = object({
    ...params
})

export type CreateRestaurantInput = TypeOf<typeof createRestaurantSchema>
export type GetRestaurantInput = TypeOf<typeof getRestaurantSchema>
export type UpdateRestaurantInput = TypeOf<typeof updateRestaurantSchema>
export type DeleteRestaurantInput = TypeOf<typeof deleteRestaurantSchema>