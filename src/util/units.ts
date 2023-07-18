import {isEmpty} from "./is-functions.ts";
import {isIntegerish} from "./numbers.ts";

/**
 * # To Web Unit
 * @param value
 * @param unit
 */
export function toWebUnit(value: string | number | null | undefined, unit: string = 'px'): string | null {
    if (isEmpty(value)) {
        return null;
    }
    if (isIntegerish(value)) {
        return `${value}${unit}`;
    }
    return value;
}