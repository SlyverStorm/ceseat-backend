import { object, number, string, TypeOf } from "zod";

const userIdRegExp = /^user_\w+/;
const cardNumberRegExp = /^\d{16}$/;
const expirationRegExp = /^\d{2}$/;

const createWalletPayload = {
    body: object({

        title: string({
            required_error: "Nom pour la nouvelle carte requis"
        }).max(35, "Taille maximale de 35 caractères"),

        cardNumber: string({
            required_error: "Numéro de la carte requis"
        }).min(16, "Taille du numérau de la carte doit être de 16 caractères")
        .max(16, "Taille du numérau de la carte doit être de 16 caractères")
        .regex(cardNumberRegExp, "Numéro de la carte invalide"),

        expirationMonth: string({
            required_error: "Mois d'expiration de la carte requis"
        }).min(2, "Le mois d'expiration doit comporter 2 caractères")
        .max(2, "Le mois d'expiration doit comporter 2 caractères")
        .regex(expirationRegExp, "Mois d'expiration invalide"),

        expirationYear: string({
            required_error: "Année d'expiration de la carte requis"
        }).min(2, "L'année d'expiration doit comporter 2 caractères")
        .max(2, "L'année d'expiration doit comporter 2 caractères")
        .regex(expirationRegExp, "Année d'expiration invalide"),

        designation: string().max(70, "Taille maximale de 70 caractères")
        .optional(),

    }).strict()
};

const updateWalletPayload = {
    body: object({

        title: string({
            required_error: "Nom pour la nouvelle carte requis"
        }).max(35, "Taille maximale de 35 caractères")
        .optional(),

        cardNumber: string({
            required_error: "Numéro de la carte requis"
        }).min(16, "Taille du numérau de la carte doit être de 16 caractères")
        .max(16, "Taille du numérau de la carte doit être de 16 caractères")
        .regex(cardNumberRegExp, "Numéro de la carte invalide")
        .optional(),

        expirationMonth: string({
            required_error: "Mois d'expiration de la carte requis"
        }).min(2, "Le mois d'expiration doit comporter 2 caractères")
        .max(2, "Le mois d'expiration doit comporter 2 caractères")
        .regex(expirationRegExp, "Mois d'expiration invalide")
        .optional(),

        expirationYear: string({
            required_error: "Année d'expiration de la carte requis"
        }).min(2, "L'année d'expiration doit comporter 2 caractères")
        .max(2, "L'année d'expiration doit comporter 2 caractères")
        .regex(expirationRegExp, "Année d'expiration invalide")
        .optional(),

        designation: string().max(70, "Taille maximale de 70 caractères")
        .optional(),

    }).strict()
};

const params = {
    params: object({
        walletid: string({
            required_error: "Identifiant de wallet est requis"
        }).regex(userIdRegExp, "Identifiant de wallet incorrect")
    }).strict()
};

export const createWalletSchema = object({
    ...createWalletPayload,
})

export const getWalletSchema = object({
    ...params
})

export const updateWalletSchema = object({
    ...updateWalletPayload,
    ...params
})

export const deleteWalletSchema = object({
    ...params
})

export type CreateWalletInput = TypeOf<typeof createWalletSchema>
export type GetWalletInput = TypeOf<typeof getWalletSchema>
export type UpdateWalletInput = TypeOf<typeof updateWalletSchema>
export type DeleteWalletInput = TypeOf<typeof deleteWalletSchema>