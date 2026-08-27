import { totalSales, totalRevenue } from "@/app/analytics/totals/totals";
import { getOrdersForAnalysis_DB_op } from "@/app/repositories/aiSlice/getOrdersForAnalysis_DB_op"

export async function totalsDashboard() {
    const orders = await getOrdersForAnalysis_DB_op()

    const sales = totalSales(orders);
    const revenue = totalRevenue(orders);

    return (
        <div className="border">
            <p>{sales}</p>
            <p>{revenue}</p>
        </div>
    )
}w