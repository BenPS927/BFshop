import { Orders } from "../../types/analysisMachine"


export function totalRevenue(orders: Orders[]) {

    const allOrders = orders

    const revenue = orders.reduce((total, order) => {
        return total + Number(order.total); 
    }, 0); 

    return revenue
    
}

export function totalSales(orders: Orders[]) {

    const sales = orders.length

    return sales 
}