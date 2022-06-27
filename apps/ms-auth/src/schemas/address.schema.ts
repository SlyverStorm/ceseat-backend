import { object, number, string, TypeOf } from "zod";

const addressIdRegExp = /^address_\w+/;

const addressPayload = {
    body: object({

        label: string({ 
            required_error: "Nom pour la nouvelle carte requis"
        }).max(60, "Taille maximale de 60 caractères"),

        longitude: number({
            required_error: "Longitude requise"
        }).min(-180, "Longitude doit être supérieure à -180").max(180, "Longitude doit être inférieure à 180"),

        latitude: number({
            required_error: "Latitude requise"
        }).min(-90, "Latitude doit être supérieure à -90").max(90, "Latitude doit être inférieure à 90"),

        designation: string().max(70, "Taille maximale de 70 caractères").optional()

    }).strict()
};

const params = {
    params: object({
        addressid: string({
            required_error: "Identifiant de Address est requis"
        }).regex(addressIdRegExp, "Identifiant de Address incorrect")
    }).strict()
};

export const createAddressSchema = object({
    ...addressPayload,
})

export const getAddressSchema = object({
    ...params
})

export const updateAddressSchema = object({
    ...addressPayload,
    ...params
})

export const deleteAddressSchema = object({
    ...params
})

export type CreateAddressInput = TypeOf<typeof createAddressSchema>
export type GetAddressInput = TypeOf<typeof getAddressSchema>
export type UpdateAddressInput = TypeOf<typeof updateAddressSchema>
export type DeleteAddressInput = TypeOf<typeof deleteAddressSchema>