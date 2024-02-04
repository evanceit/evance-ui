import {isEmpty} from "./is-functions.ts";

/**
 * # To Web Unit
 * @param value
 * @param unit
 */
export function toWebUnit(value: string | number | null | undefined, unit: string = 'px'): string | undefined {
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