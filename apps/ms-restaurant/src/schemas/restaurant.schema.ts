import { object, number, string, TypeOf, boolean, array } from "zod";

const createRestaurantPayload = {
    body: object({

        name: string({
            required_error: "Nom du restaurant requis"
        }).max(35, "Taille maximale de 35 caractères"),

        image: string().max(255, "Taille maximale de 255 caractères").optional(),

        description: string().max(500, "Taille maximale de 500 caractères").optional(),

        address: object({

            label: string({
                required_error: "Label de l'adresse requis"
            }).max(60, "Taille maximale de 60 caractères"),

            longitude: number({
                required_error: "Longitude requise"
            }).min(-180, "Longitude doit être supérieure à -180")
            .max(180, "Longitude doit être inférieure à 180"),
    
            latitude: number({
                required_error: "Latitude requise"
            }).min(-90, "Latitude doit être supérieure à -90")
            .max(90, "Latitude doit être inférieure à 90"),

        }).strict(),

        // userId: string({
        //     required_error: "Identifiant de l'utilisateur requis"
        // })

    }).strict()
};

const updateRestaurantPayload = {
    body: object({

        name: string({
            required_error: "Nom du restaurant requis"
        }).max(35, "Taille maximale de 35 caractères")
        .optional(),

        image: string().max(255, "Taille maximale de 255 caractères").optional(),

        description: string().max(500, "Taille maximale de 500 caractères").optional(),

        address: object({

            label: string({
                required_error: "Label de l'adresse requis"
            }).max(60, "Taille maximale de 60 caractères")
            .optional(),

            longitude: number({
                required_error: "Longitude requise"
            }).min(-180, "Longitude doit être supérieure à -180")
            .max(180, "Longitude doit être inférieure à 180")
            .optional(),
    
            latitude: number({
                required_error: "Latitude requise"
            }).min(-90, "Latitude doit être supérieure à -90")
            .max(90, "Latitude doit être inférieure à 90")
            .optional(),

        }).strict().optional(),

        // userId: string({
        //     required_error: "Identifiant de l'utilisateur requis"
        // }).optional()

    }).strict()
};

const params = {
    params: object({
        restaurantid: string({
            required_error: "Identifiant du restaurant est requis"
        })
    }).strict()
};

export const createRestaurantSchema = object({
    ...createRestaurantPayload,
})

export const getRestaurantSchema = object({
    ...params
})

export const updateRestaurantSchema = object({
    ...updateRestaurantPayload,
})


export type CreateRestaurantInput = TypeOf<typeof createRestaurantSchema>
export type GetRestaurantInput = TypeOf<typeof getRestaurantSchema>
export type UpdateRestaurantInput = TypeOf<typeof updateRestaurantSchema>