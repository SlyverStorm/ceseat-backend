import { object, string, TypeOf } from "zod";

const params = {
    params: object({
        restaurantid: string({
            required_error: "Identifiant de restaurant requis"
        })
    }).strict()
};

export const getRestaurantSchema = object({
    ...params
})


export type GetRestaurantInput = TypeOf<typeof getRestaurantSchema>