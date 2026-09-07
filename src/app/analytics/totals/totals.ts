export function totalRevenue(orders: { total: number }[]) {
    const revenue = orders.reduce((total, order) => {
        return total + Number(order.total); 
    }, 0); 

    return revenue
    
}

export function totalSales(orders: unknown[]) {

    const sales = orders.length

    return sales 
}

export function totalItemsSold(
    orders: { orderItems: { quantity: number }[] }[],
) {

    const itemsSold = orders.reduce((orderTotal, order) => {
        const itemsInOrder = order.orderItems.reduce((itemTotal, orderItem) => {
            return itemTotal + orderItem.quantity
        }, 0)

        return orderTotal + itemsInOrder
    }, 0)

    return itemsSold
}
