export const BUSINESS_TIME_ZONE = "Australia/Sydney";

const businessDateFormatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export function toBusinessDate(date: Date): string {
    const parts = businessDateFormatter.formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (!year || !month || !day) {
        throw new Error("Unable to determine the business date");
    }

    return `${year}-${month}-${day}`;
}

export function listBusinessDates(startDate: string, endDate: string): string[] {
    if (startDate > endDate) {
        throw new Error("The start date must be before or equal to the end date");
    }

    const dates: string[] = [];
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
    const currentDate = new Date(Date.UTC(startYear, startMonth - 1, startDay));
    const finalDate = new Date(Date.UTC(endYear, endMonth - 1, endDay));

    while (currentDate <= finalDate) {
        dates.push(currentDate.toISOString().slice(0, 10));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
}
