import type { Period } from "../../types/slice3MetricsAndHistory/analysisRequest";
import { listBusinessDates, toBusinessDate } from "./businessDates";

type DatedOrder = {
  created_at: Date;
};

export type OrderIntervalGroup<TOrder extends DatedOrder> = {
  startDate: string;
  endDate: string;
  orders: TOrder[];
};

function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getNaturalBounds(
  date: string,
  interval: Period["interval"]
): [string, string] {
  const start = parseDate(date);
  const end = parseDate(date);

  if (interval === "week") {
    const daysSinceMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);
    end.setTime(start.getTime());
    end.setUTCDate(end.getUTCDate() + 6);
  }

  if (interval === "month") {
    start.setUTCDate(1);
    end.setUTCFullYear(start.getUTCFullYear(), start.getUTCMonth() + 1, 0);
  }

  return [formatDate(start), formatDate(end)];
}

export function groupOrdersByInterval<TOrder extends DatedOrder>(
  orders: TOrder[],
  period: Period
): OrderIntervalGroup<TOrder>[] {
  const [requestedStart, requestedEnd] = period.dateRange;
  const groups = new Map<string, OrderIntervalGroup<TOrder>>();

  for (const date of listBusinessDates(requestedStart, requestedEnd)) {
    const [naturalStart, naturalEnd] = getNaturalBounds(date, period.interval);

    if (!groups.has(naturalStart)) {
      groups.set(naturalStart, {
        startDate: naturalStart < requestedStart ? requestedStart : naturalStart,
        endDate: naturalEnd > requestedEnd ? requestedEnd : naturalEnd,
        orders: [],
      });
    }
  }

  for (const order of orders) {
    const orderDate = toBusinessDate(new Date(order.created_at));
    const [naturalStart] = getNaturalBounds(
      orderDate,
      period.interval
    );

    groups.get(naturalStart)?.orders.push(order);
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
}
