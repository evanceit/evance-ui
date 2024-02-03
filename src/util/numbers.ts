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