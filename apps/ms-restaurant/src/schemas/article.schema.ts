import { object, number, string, TypeOf, boolean } from "zod";

const createArticlePayload = {
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

        articleCatId: string({
            required_error: "Identifiant de ArticleCategory requis"
        })

    }).strict()
};

const updateArticlePayload = {
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

        articleCatId: string({
            required_error: "Identifiant de ArticleCategory requis"
        }).optional()

    }).strict()
};

const params = {
    params: object({
        articleid: string({
            required_error: "Identifiant d'article est requis"
        })
    }).strict()
};

export const createArticleSchema = object({
    ...createArticlePayload,
})

export const getArticleSchema = object({
    ...params
})

export const updateArticleSchema = object({
    ...updateArticlePayload,
    ...params
})

export const deleteArticleSchema = object({
    ...params
})

export type CreateArticleInput = TypeOf<typeof createArticleSchema>
export type GetArticleInput = TypeOf<typeof getArticleSchema>
export type UpdateArticleInput = TypeOf<typeof updateArticleSchema>
export type DeleteArticleInput = TypeOf<typeof deleteArticleSchema>