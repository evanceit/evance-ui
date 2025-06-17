/**
 * # Integerish Pattern
 */
export const IntegerishPattern: RegExp = /^\d+$/;

/**
 * # Is Integerish
 * @param value
 */
export function isIntegerish(value: string | number): boolean {
    return IntegerishPattern.test(value.toString());
}

export type NumberPartType =
    | Exclude<Intl.NumberFormatPartTypes, "minusSign" | "plusSign">
    | "sign"
    | "prefix"
    | "suffix";

type IntegerPart = {
    type: NumberPartType & "integer";
    value: number;
};

type FractionPart = {
    type: NumberPartType & "fraction";
    value: number;
};

type DigitPart = IntegerPart | FractionPart;

type SymbolPart = {
    type: Exclude<NumberPartType, "integer" | "fraction">;
    value: string;
};

export type NumberPartKey = string;
type KeyedPart = { key: NumberPartKey };
export type KeyedDigitPart = DigitPart & KeyedPart & { pos: number };
export type KeyedSymbolPart = SymbolPart & KeyedPart;
export type KeyedNumberPart = KeyedDigitPart | KeyedSymbolPart;

export type NumberFormat = Omit<Intl.NumberFormatOptions, "notation"> & {
    notation?: Exclude<
        Intl.NumberFormatOptions["notation"],
        "scientific" | "engineering"
    >;
};

export type NumberValue = Exclude<
    Parameters<typeof Intl.NumberFormat.prototype.formatToParts>[0],
    bigint | undefined
>;

export function splitNumberToParts(
    value: NumberValue,
    formatter: Intl.NumberFormat,
    prefix?: string,
    suffix?: string,
) {
    const parts: Array<
        Omit<Intl.NumberFormatPart, "type"> & {
            type: Intl.NumberFormatPartTypes | "prefix" | "suffix";
        }
    > = formatter.formatToParts(value);

    if (prefix) {
        parts.unshift({ type: "prefix", value: prefix });
    }
    if (suffix) {
        parts.push({ type: "suffix", value: suffix });
    }

    const start: KeyedNumberPart[] = [];
    const integers: Array<IntegerPart | SymbolPart> = []; // we do a second pass to key these from RTL
    const fraction: KeyedNumberPart[] = [];
    const end: KeyedNumberPart[] = [];
    const counts: Partial<Record<NumberPartType, number>> = {};

    const nextIndex = (type: NumberPartType) => {
        return (counts[type] = (counts[type] ?? -1) + 1);
    };
    const generateKey = (type: NumberPartType) => `${type}:${nextIndex(type)}`;

    let valueAsString = "";
    let parsedInteger = false;
    let parsedDecimal = false;

    for (const part of parts) {
        valueAsString += part.value;

        const type: NumberPartType =
            part.type === "minusSign" || part.type === "plusSign"
                ? "sign"
                : part.type;

        if (type === "integer") {
            parsedInteger = true;
            integers.push(
                ...part.value
                    .split("")
                    .map((d) => ({ type, value: parseInt(d) })),
            );
        } else if (type === "group") {
            integers.push({ type, value: part.value });
        } else if (type === "decimal") {
            parsedDecimal = true;
            fraction.push({ type, value: part.value, key: generateKey(type) });
        } else if (type === "fraction") {
            fraction.push(
                ...part.value.split("").map((d) => ({
                    type,
                    value: parseInt(d),
                    key: generateKey(type),
                    pos: -1 - counts[type]!,
                })),
            );
        } else {
            (parsedInteger || parsedDecimal ? end : start).push({
                type,
                value: part.value,
                key: generateKey(type),
            });
        }
    }

    const integer: KeyedNumberPart[] = [];

    // Key the integer parts RTL, for better layout animations
    for (let i = integers.length - 1; i >= 0; i--) {
        const integerPart = integers[i]!;
        integer.unshift(
            integerPart.type === "integer"
                ? {
                      ...integerPart,
                      key: generateKey(integerPart.type),
                      pos: counts[integerPart.type]!,
                  }
                : { ...integerPart, key: generateKey(integerPart.type) },
        );
    }

    return {
        start,
        integer,
        fraction,
        end,
        valueAsString,
        value: typeof value == "string" ? parseFloat(value) : value,
    };
}
