export function inferTimeFormat(value: unknown) {
    if (value instanceof Date) {
        return "date";
    }
    if (typeof value === "string") {
        if (/^\d{2}:\d{2}$/.test(value)) {
            return "time";
        }
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
            return "datetime";
        }
    }
    return "time";
}

export function normalizeTimeToDate(value: unknown) {
    if (!value) {
        return null;
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
        return new Date(value);
    }
    if (typeof value === "string") {
        // HH:mm
        if (/^\d{2}:\d{2}$/.test(value)) {
            const [h, m] = value.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        }
        // Y-m-d H:i:s
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
            const d = new Date(value.replace(" ", "T"));
            return isNaN(d.getTime()) ? null : d;
        }
        // fallback (ISO, etc.)
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

export function serializeDateToTime(
    date: Date,
    format: "time" | "date" | "datetime",
): Date | string | null {
    if (!date) {
        return null;
    }
    const d = new Date(date);
    d.setSeconds(0, 0);

    if (format === "date") {
        return d;
    }
    if (format === "time") {
        return d.toTimeString().slice(0, 5); // HH:mm
    }
    if (format === "datetime") {
        const pad = (n: number) => String(n).padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day} ${hour}:${minutes}:00`;
    }
    return null;
}

export function displayTimeFromDate(date: Date | null) {
    return date ? date.toTimeString().slice(0, 5) : "";
}