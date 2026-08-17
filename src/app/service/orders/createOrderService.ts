import { GetCustomer_DB_op } from "@/app/repositories/orders/GetCustomer_DB_op";
import { GetProduct_DB_op } from "@/app/repositories/orders/GetProduct_DB_op";
import { WriteOrder_DB_op } from "@/app/repositories/orders/WriteOrder_DB_op";
import { WriteOrderItems_DB_op } from "@/app/repositories/orders/WriteOrderItems_DB_op";
import { CreateOrderRequest, CreatedOrder, BackendOrderItem, CustomerType, WrittenOrderItems } from "@/app/types/orders";
import { prisma } from "@/server/db";
import type { Prisma } from "@/generated/prisma/client";

export async function createOrderService(order: CreateOrderRequest) {

    console.log("SERVICE: Starting createOrderService");

    return await prisma.$transaction(async (tx) => {
        console.log("SERVICE: Transaction started");


            console.log("SERVICE: Processing Customer")
            const customerId = order.customerId 

            async function processCustomer( tx: Prisma.TransactionClient, customerId: number ): Promise<Awaited<ReturnType<typeof GetCustomer_DB_op>>>  {
            
                const customer = await GetCustomer_DB_op(tx, customerId);
                console.log("SERVICE: received customer");
                return customer;
            }
            const customer = await processCustomer(tx, customerId); //customer doesnt need to be verified as this function would fail did it not exist


            
            console.log("SERVICE: Processing product")
            const productIds = order.items.map(function(item) {
                return item.productId;    }
            )

            async function processProduct( tx: Prisma.TransactionClient, productIds: number[] ): Promise<Awaited<ReturnType<typeof GetProduct_DB_op>>>  {
            
                const products = await GetProduct_DB_op(tx, productIds);
                console.log("SERVICE: received product");

                order.items.map(item => {
                    const product = products.find(product => 
                        product.id === item.productId
                    );
                        
                    if (!product) {
                    throw new Error("Product not found");
                    }

                    if (product.stock < item.quantity) {
                        throw new Error ("One or more products have insufficient stock")
                    }
                    
                    
                })
                
                 
                 return products;
            }

            const products = await processProduct(tx, productIds);



             function createOrderItems( order: CreateOrderRequest ) {
                return order.items.map(item => {
                    const product = products.find(product => 
                        product.id === item.productId
                    );

                     if (!product) {
                    throw new Error("Product not found");
                    }

                    const backendOrderItem: BackendOrderItem = {
                        product_id: product.id,
                        product_name: product.title,
                        quantity: item.quantity,
                        unit_price: product.price,
                        line_total: product.price * item.quantity
                    };

                   return backendOrderItem;
            
            
             });
            }
                    
            const orderItems = createOrderItems(order);
            console.log(" SERVICE: Order items created", orderItems);



            async function createOrder( tx: Prisma.TransactionClient, customer: CustomerType, orderItems: BackendOrderItem[]) {
               
                const total = orderItems.reduce((total, item) => {
                    return total + item.line_total;
                }, 0);

                const orderData =  {
                        customerId: customer.id,
                        status: 'received',
                        total: total 
	                    
                    };

                const createdOrder = await WriteOrder_DB_op(tx, orderData)
                return createdOrder
            }
            const createdOrder = await createOrder(tx, customer, orderItems)
            console.log("SERVICE: Order created", createdOrder);


            
            async function writeOrderItems (tx: Prisma.TransactionClient, orderItems: BackendOrderItem[], createdOrder: CreatedOrder): Promise<WrittenOrderItems[]> {

                const writtenItems = await Promise.all(
                    orderItems.map(async (item) => {
                        return await WriteOrderItems_DB_op(tx, item, createdOrder)
                    })
                )

                return writtenItems
            }
                
            const writtenOrderItems: WrittenOrderItems[] = await writeOrderItems(tx, orderItems, createdOrder)
            console.log("SERVICE: Order Items written to database")

            return createdOrder
        });
        

}