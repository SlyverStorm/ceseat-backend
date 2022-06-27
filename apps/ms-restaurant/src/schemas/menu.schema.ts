import { object, number, string, TypeOf, boolean, array } from "zod";

const createMenuPayload = {
    body: object({

        name: string({
            required_error: "Nom de l'article requis"
        }).max(35, "Taille maximale de 35 caractères"),

        image: string().max(255, "Taille maximale de 255 caractères").optional(),

        description: string().max(500, "Taille maximale de 500 caractères").optional(),

        price: number({
            required_error: "Prix requis"
        }).min(0, "Prix doit être supérieur à 0"),

        isAvailable: boolean().default(false).optional(),

        content: array(
            object({

                sectionName: string({
                    required_error: "Nom de la section requis"
                }).max(35, "Taille maximale de 35 caractères"),

                articles: array(string()).min(1, "La section doit contenir au moins un article")

            }).strict()
        ).optional(),

    }).strict()
};

const updateMenuPayload = {
    body: object({

        name: string({
            required_error: "Nom de l'article requis"
        }).max(35, "Taille maximale de 35 caractères")
        .optional(),

        image: string().max(255, "Taille maximale de 255 caractères").optional(),

        description: string().max(500, "Taille maximale de 500 caractères").optional(),

        price: number({
            required_error: "Prix requis"
        }).min(0, "Prix doit être supérieur à 0")
        .optional(),

        isAvailable: boolean().default(false).optional(),

        content: array(
            object({

                sectionName: string({
                    required_error: "Nom de la section requis"
                }).max(35, "Taille maximale de 35 caractères"),

                articles: array(string()).min(1, "La section doit contenir au moins un article")

            }).strict()
        ).optional(),

    }).strict()
};

const params = {
    params: object({
        articleid: string({
            required_error: "Identifiant d'article est requis"
        })
    }).strict()
};

export const createMenuSchema = object({
    ...createMenuPayload,
})

export const getMenuSchema = object({
    ...params
})

export const updateMenuSchema = object({
    ...updateMenuPayload,
    ...params
})

export const deleteMenuSchema = object({
    ...params
})

export type CreateMenuInput = TypeOf<typeof createMenuSchema>
export type GetMenuInput = TypeOf<typeof getMenuSchema>
export type UpdateMenuInput = TypeOf<typeof updateMenuSchema>
export type DeleteMenuInput = TypeOf<typeof deleteMenuSchema>