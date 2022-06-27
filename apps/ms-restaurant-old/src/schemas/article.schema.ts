import { object, number, string, TypeOf, boolean } from "zod";

const articleIdRegExp = /^article_\w+/;

const createArticlePayload = {
    body: object({

        name: string({
            required_error: "Nom de l'article requis"
        }).max(35, "Taille maximale de 35 caractères"),

        image: string().max(255, "Taille maximale de 255 caractères").optional(),

        description: string().max(500, "Taille maximale de 500 caractères").optional(),

        price: number({
            required_error: "Prix de l'article requis"
        }),

        isAvailable: boolean().default(false).optional(),

        //restaurantId: "Automaticaly handled by controller (get restaurant)"

        articlesCatId: number({
            required_error: "La catégorie de cet article est requise",
        }),

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
            required_error: "Prix de l'article requis"
        }).optional(),

        isAvailable: boolean().optional(),

        //restaurantId: "Automaticaly handled by controller (get restaurant)"

        articlesCatId: number({
            required_error: "La catégorie de cet article est requise",
        }).optional(),

    }).strict()
}

const params = {
    params: object({
        articleId: string({
            required_error: "Identifiant d'article requis"
        }).regex(articleIdRegExp, "Identifiant d'article incorrect")
    }).strict()
};

export const createArticleSchema = object({
    ...createArticlePayload
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