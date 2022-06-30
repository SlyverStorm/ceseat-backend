import { object, number, string, TypeOf, boolean, array } from "zod";

const driverStatusQueryOptional = {
    query: object({
        lat: number({}).min(-90, "Latitude doit être supérieure à -90").max(90, "Latitude doit être inférieure à 90").optional(),
        lng: number({}).min(-180, "Longitude doit être supérieure à -180").max(180, "Longitude doit être inférieure à 180").optional()
    }).strict()
};

const driverStatusQueryMandatory = {
    query: object({
        lat: number({}).min(-90, "Latitude doit être supérieure à -90").max(90, "Latitude doit être inférieure à 90"),
        lng: number({}).min(-180, "Longitude doit être supérieure à -180").max(180, "Longitude doit être inférieure à 180")
    }).strict()
};


export const getDriverStatusOptionalSchema = object({
    ...driverStatusQueryOptional,
})

export const getDriverStatusMandatorySchema = object({
    ...driverStatusQueryMandatory,
})

export type GetDriverStatusOptionalInput = TypeOf<typeof getDriverStatusOptionalSchema>
export type GetDriverStatusMandatoryInput = TypeOf<typeof getDriverStatusMandatorySchema>