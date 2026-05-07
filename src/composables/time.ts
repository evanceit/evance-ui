import {isDate} from "@/util";

export type DateTimeFormat =
    | "time"
    | "date"
    | "sql-date"
    | "sql-datetime"
    | "iso-datetime";

export interface ParseDateTimeValue<TInput = unknown> {
    format: DateTimeFormat;
    date: Date | null;
    transformOut: (date: Date | null) => TInput | null;
}

export interface ParseDateTimeOptions {
    preserveTime?: boolean;
}

export interface DateTimeFormatHandler<TInput = unknown> {
    matches(value: unknown): value is TInput;
    parse(
        value: TInput,
        options?: ParseDateTimeOptions,
    ): ParseDateTimeValue<TInput>;
}

export const timeHandler: DateTimeFormatHandler<string | null> = {
    matches(value: unknown): value is string {
        return isTime(value);
    },
    parse(value: string | null): ParseDateTimeValue<string | null> {
        let date = null;
        if (value) {
            const [hours, minutes] = value.split(":").map(Number);
            date = new Date();
            date.setHours(hours, minutes, 0, 0);
        }
        return {
            format: "time",
            date,
            transformOut: (date: Date | string | null) => {
                return isDate(date) ? formatTime(date) : date;
            },
        };
    },
};

export const sqlDateHandler: DateTimeFormatHandler<string> = {
    matches(value): value is string {
        return isSqlDate(value);
    },
    parse(value: string | null) {
        let date = null;
        if (value) {
            const match = value.match(/^(\d{4}-\d{2}-\d{2})$/);
            if (match) {
                const [, sqlDate] = match;
                date = new Date(`${sqlDate}T00:00:00`);
            }
        }
        return {
            format: "sql-date",
            date,
            transformOut: (date: Date | null) => {
                return date ? formatDate(date) : null;
            },
        };
    },
};

export const sqlDateTimeHandler: DateTimeFormatHandler<string> = {
    matches(value): value is string {
        return isSqlDateTime(value);
    },
    parse(value: string, options?: ParseDateTimeOptions) {
        const isPreserveTime = options?.preserveTime ?? false;
        let date = null;
        let time = null;
        const match = value.match(
            /^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/,
        );
        if (match) {
            const [, sqlDate, hours, minutes, seconds = "00"] = match;
            time = `${hours}:${minutes}:${seconds}`;
            date = new Date(`${sqlDate}T${time}`);
        }
        return {
            format: "sql-datetime",
            date,
            transformOut: (date: Date | null) => {
                if (!date) {
                    return null;
                }
                return isPreserveTime && time
                    ? `${formatDate(date)} ${time}`
                    : `${formatDate(date)} ${formatTime(date)}:00`;
            },
        };
    },
};

export const isoDateTimeHandler: DateTimeFormatHandler<string> = {
    matches(value): value is string {
        return isIsoDateTime(value);
    },
    parse(value, options?: ParseDateTimeOptions) {
        const isPreserveTime = options?.preserveTime ?? false;
        let date = null;
        let time = null;
        let meta = {
            sqlDate: null,
            offset: null,
            hasSeconds: false,
            hasMilliseconds: false,
        };
        const match = value.match(
            /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
        );
        if (match) {
            const [
                ,
                sqlDate,
                hours,
                minutes,
                seconds = "00",
                milliseconds,
                offset,
            ] = match;
            date = new Date(sqlDate);
            date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
            time = `${hours}:${minutes}:${seconds}`;
            meta = {
                sqlDate,
                offset,
                hasSeconds: seconds !== undefined,
                hasMilliseconds: milliseconds !== undefined,
            };
        }
        return {
            format: "iso-datetime",
            date,
            transformOut: (date: Date | null) => {
                if (!date) return null;
                const sqlDate = formatDate(date);
                const offset = meta.offset ?? "Z";
                return isPreserveTime && time
                    ? `${sqlDate}T${time}${offset}`
                    : `${sqlDate}T${formatTime(date)}:00${offset}`;
            },
        };
    },
};

export const dateObjectHandler: DateTimeFormatHandler<Date> = {
    matches(value): value is Date {
        return value instanceof Date && !Number.isNaN(value.getTime());
    },
    parse(value, options?: ParseDateTimeOptions) {
        const isPreserveTime = options?.preserveTime ?? false;
        const date = value ? new Date(value) : null;
        const time = date
            ? {
                  hours: date.getHours(),
                  minutes: date.getMinutes(),
                  seconds: date.getSeconds(),
              }
            : null;
        return {
            format: "date",
            date,
            transformOut: (date: Date | null) => {
                if (!date || !isPreserveTime || !time) {
                    return date;
                }
                date.setHours(time.hours, time.minutes, time.seconds);
                return date;
            },
        };
    },
};

export const timeFormatHandlers = [
    timeHandler,
    sqlDateTimeHandler,
    isoDateTimeHandler,
    dateObjectHandler,
];

export const dateFormatHandlers = [
    sqlDateHandler,
    sqlDateTimeHandler,
    isoDateTimeHandler,
    dateObjectHandler,
];

export function formatDate(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export function formatTime(date: Date): string {
    return [
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
    ].join(":");
}

/**
 * Determine if a value is a time string (HH:mm)
 * @param value
 */
export function isTime(value: unknown) {
    return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

export function isSqlDate(value: unknown) {
    return (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    );
}

/**
 * Determine if a value is a date-time string (YYYY-MM-DD HH:mm:ss)
 * @param value
 */
export function isSqlDateTime(value: unknown) {
    return (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    );
}

/**
 * Determines if a value is an ISO 8601 date-time string:
 * - 2026-04-26T15:10:58+01:00
 * - 2026-04-26T15:10:58Z
 * - 2026-04-26T15:10:58.123Z
 * - 2026-04-26T15:10+01:00
 * @param value
 */
export function isIsoDateTime(value: unknown) {
    if (typeof value !== "string") {
        return false;
    }
    const isoDateTimePattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(?:Z|[+-]\d{2}:\d{2})$/;
    return isoDateTimePattern.test(value) && !Number.isNaN(Date.parse(value));
}

export function inferDateFormat(
    value: unknown,
    defaultHandler = sqlDateHandler,
): DateTimeFormatHandler {
    return (
        dateFormatHandlers.find((handler) => handler.matches(value)) ??
        defaultHandler
    );
}

export function inferTimeFormat(
    value: unknown,
    defaultHandler = timeHandler,
): DateTimeFormatHandler {
    return (
        timeFormatHandlers.find((handler) => handler.matches(value)) ??
        defaultHandler
    );
}

export function displayTimeFromDate(date: Date | null) {
    return date ? formatTime(date) : "";
}