import { object, string, TypeOf } from "zod";

const createSessionPayload = {
    body: object({
        email: string({
            required_error: "Adresse email requis "
        }).email().max(320, "Taille maximale de 320 caractères"),
        password: string({
            required_error: "Mot-de-passe requis"
        })
    }).strict()
};

export const createSessionSchema = object({
    ...createSessionPayload
})

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;