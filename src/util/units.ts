import { isEmpty } from "./is-functions";

/**
 * # To Web Unit
 * @param value
 * @param unit
 */
export function toWebUnit(
    value?: string | number,
    unit: string = "px",
): string | undefined {
    if (isEmpty(value)) {
        return undefined;
    }
    if (isNaN(+value!)) {
        return String(value);
    }
    if (!isFinite(+value!)) {
        return undefined;
    }
    return `${value}${unit}`;
}

/**
 * # Pixel Round
 * @param value
 */
export function pixelRound(value: number): number {
    return Math.round(value * devicePixelRatio) / devicePixelRatio;
}

/**
 * # Pixel Ceil
 * @param value
 */
export function pixelCeil(value: number): number {
    return Math.round(value * devicePixelRatio) / devicePixelRatio;
}

/**
 * # extractWebUnit
 * @param value
 */
export function extractWebUnit(value: string) {
    const regex = /^(-?\d+(?:\.\d+)?)\s*([a-zA-Z%]*)$/;
    const match = value.match(regex);
    if (!match) {
        return undefined;
    }
    return {
        value: parseFloat(match[1]),
        unit: match[2] ?? "px",
    };
}
