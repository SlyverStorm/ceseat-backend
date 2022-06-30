// import { object, number, string, TypeOf, boolean } from "zod";

// const createOrderPayload = {
//     body: object({

//     }).strict()
// };

// const params = {
//     params: object({
//         orderid: string({
//             required_error: "Identifiant de commande order est requis"
//         })
//     }).strict()
// };

// export const createOrderSchema = object({
//     ...createOrderPayload,
// })

// export const getOrderSchema = object({
//     ...params
// })

// export const updateOrderSchema = object({
//     ...updateOrderPayload,
//     ...params
// })

// export const deleteOrderSchema = object({
//     ...params
// })

// export type CreateOrderInput = TypeOf<typeof createOrderSchema>
// export type GetOrderInput = TypeOf<typeof getOrderSchema>
// export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>
// export type DeleteOrderInput = TypeOf<typeof deleteOrderSchema>