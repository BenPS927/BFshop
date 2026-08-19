import { GetCustomer_DB_op } from "@/app/repositories/orders/GetCustomer_DB_op";
import { writeNewCustomer_DB_op } from "@/app/repositories/orders/writeNewCustomer_DB_op";
import { GetProduct_DB_op } from "@/app/repositories/orders/GetProduct_DB_op";
import { WriteOrder_DB_op } from "@/app/repositories/orders/WriteOrder_DB_op";
import { WriteOrderItems_DB_op } from "@/app/repositories/orders/WriteOrderItems_DB_op";
import { FrontendOrder, Customer } from "@/app/types/generateOrder";
import { BackendOrderItem, CreatedOrder, WrittenOrderItems } from "@/app/types/orders";
import { prisma } from "@/server/db";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";

export async function generatedOrderService(
    order: FrontendOrder,
    customer: Customer,
    FrontendOrderItems: FrontendOrder["orderItems"]
) {

    console.log("SERVICE: Starting createOrderService");

    return await (async (tx: Prisma.TransactionClient | PrismaClient) => {
        console.log("SERVICE: Order generation started");

        async function processCustomer(
            tx: Prisma.TransactionClient | PrismaClient,
            customer: Customer
        ) {
            if (customer.id !== undefined) {
                const existingCustomer = await GetCustomer_DB_op(tx, customer.id);

                if (existingCustomer) {
                    return existingCustomer;
                }
            }

            return await writeNewCustomer_DB_op(tx, customer);
        }

        const savedCustomer = await processCustomer(tx, order.customer);
        console.log("SERVICE: Customer ready", savedCustomer);

        console.log("SERVICE: Processing product");

        const productIds = order.orderItems.map((item) => {
            return item.productId;
        });

        async function processProduct(
            tx: Prisma.TransactionClient | PrismaClient,
            productIds: number[]
        ): Promise<Awaited<ReturnType<typeof GetProduct_DB_op>>> {
            const products = await GetProduct_DB_op(tx, productIds);
            console.log("SERVICE: received product");

            order.orderItems.map((item) => {
                const product = products.find(
                    (product) => product.id === item.productId
                );

                if (!product) {
                    throw new Error("Product not found");
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        "One or more products have insufficient stock"
                    );
                }
            });

            return products;
        }

        const products = await processProduct(tx, productIds);

        function createOrderItems(order: FrontendOrder) {
            return order.orderItems.map((item) => {
                const product = products.find(
                    (product) => product.id === item.productId
                );

                if (!product) {
                    throw new Error("Product not found");
                }

                const backendOrderItem: BackendOrderItem = {
                    product_id: product.id,
                    product_name: product.title,
                    quantity: item.quantity,
                    unit_price: product.price,
                    line_total: product.price * item.quantity,
                };

                return backendOrderItem;
            });
        }

        const orderItems = createOrderItems(order);
        console.log("SERVICE: Order items created", orderItems);

        async function createOrder(
            tx: Prisma.TransactionClient | PrismaClient,
            customer: Customer,
            orderItems: BackendOrderItem[]
        ) {
            if (customer.id === undefined) {
                throw new Error("Customer must have an ID before creating an order");
            }

            const total = orderItems.reduce((total, item) => {
                return total + item.line_total;
            }, 0);

            const orderData = {
                customerId: customer.id,
                status: "received",
                total,
            };

            const createdOrder = await WriteOrder_DB_op(tx, orderData);
            return createdOrder;
        }

        const createdOrder = await createOrder(tx, savedCustomer, orderItems);
        console.log("SERVICE: Order created", createdOrder);

        async function writeOrderItems(
            tx: Prisma.TransactionClient | PrismaClient,
            orderItems: BackendOrderItem[],
            createdOrder: CreatedOrder
        ): Promise<WrittenOrderItems[]> {
            const writtenItems = await Promise.all(
                orderItems.map(async (item) => {
                    return await WriteOrderItems_DB_op(tx, item, createdOrder);
                })
            );

            return writtenItems;
        }

        const writtenOrderItems: WrittenOrderItems[] = await writeOrderItems(
            tx,
            orderItems,
            createdOrder
        );
        console.log("SERVICE: Order items written to database");

        return createdOrder;

    })(prisma);
}