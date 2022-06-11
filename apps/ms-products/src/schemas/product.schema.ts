import { object, number, string, TypeOf, any } from "zod"

const payload = {
    body: object({
        title: string({
            required_error: "Product title is required"
        }),
        description: string({
            required_error: "Product description is required"
        })
        .min(10, "Product description should be at least 10 characters long")
        .max(300, "Product description should be 300 characters long maximum"),
        img: any().optional(),
        price: number({
            required_error: "Product price is required"
        })
    })
};

const params = {
    params: object({
        _id: string({
            required_error: "Product Id is requiered"
        })
    })
};

export const createProductSchema = object({
    ...payload
})

export const getProductSchema = object({
    ...params
})

export const updateProductSchema = object({
    ...payload,
    ...params
})

export const deleteProductSchema = object({
    ...params
})

export type CreateProductInput = TypeOf<typeof createProductSchema>
export type GetProductInput = TypeOf<typeof getProductSchema>
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>