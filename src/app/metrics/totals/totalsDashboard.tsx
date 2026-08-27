import { totalSales, totalRevenue } from "@/app/analytics/totals/totals";
import { getOrdersForAnalysis } from "@/app/repositories/aiSlice/getOrdersForAnalysis"

export async function totalsDashboard() {
    const orders = await getOrdersForAnalysis()

    const sales = totalSales(orders);
    const revenue = totalRevenue(orders);

    return (
        <div className="border">
            <p>{totalSales}</p>
            <p>{totalRevenue}</p>
        </div>
    )
}w