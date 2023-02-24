import dayjs from "dayjs";

export interface AppDate {
    day: number;
    month: number;
    year: number;
}

export interface AppTimestamp {
    day: number;
    month: number;
    year: number;
}

export function addDays(date: AppDate, days: number) {
    if (!validateAppDate(date)) {
        throw new Error("Invalid date")
    }

    let d = dayjs(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD')
    d = d.add(days, "day")
    return {
        day: d.get("date"),
        month: d.get("month") + 1,
        year: d.get("year")
    }
}

export function validateAppDate(date: AppDate) {
    if (date.year < 2000 || date.year > 3000) {
        return false
    }

    if (date.month < 1 || date.month > 12) {
        return false
    }

    const days = daysInMonth(date.year, date.month);

    if (date.day < 1 || date.day > days) {
        return false
    }

    return true
}


export function daysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}