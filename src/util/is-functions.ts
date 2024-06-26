/**
 * # Is (equal)
 * I had written a polyfill for this, but since we're only interested in modern browsers
 * let's reduce code and simply return the result from Object.is();
 * @param a
 * @param b
 */
export function is(a?: any, b?: any): boolean {
    return Object.is(a, b);
}

/**
 * # Is Array?
 * @param value
 */
export function isArray(value: unknown): boolean {
    return Array.isArray(value);
}

/**
 * # Is Boolean?
 * @param value
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

/**
 * # Is CSS Variable
 * @param value
 */
export function isCssVariable(value: unknown): boolean {
    if (!isString(value)) {
        return false;
    }
    return /^--[\w-]+$/.test(value as string);
}

/**
 * # Is Date?
 * @param value
 */
export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

/**
 * # Is Date Equal
 *
 * Evaluates whether one date equals another date.
 *
 * @param a
 * @param b
 */
export function isDateEqual(a: Date, b: Date): boolean {
    return a.getTime() === b.getTime();
}

/**
 * # Is Deep Equal?
 *
 * I could have used the `deep-equal` npm package, but decided to keep things as light-weight
 * as possible and this suits our needs for now:
 *
 * @link https://www.npmjs.com/package/deep-equal
 *
 * @param a
 * @param b
 */
export function isDeepEqual(a: any, b: any): boolean {
    if (a === b) {
        return true;
    }
    // Check types
    if (typeof a !== typeof b) {
        return false;
    }
    if (a == null || b == null) {
        return false;
    }

    // Check dates
    if (isDate(a) && isDate(b) && !isDateEqual(a, b)) {
        return false;
    }
    // Check array
    if (isArray(a) !== isArray(b)) {
        return false;
    }

    if (a !== Object(a) || b !== Object(b)) {
        return false;
    }

    const keysInA = Object.keys(a);
    const keysInB = Object.keys(b);
    if (keysInA.length !== keysInB.length) {
        return false;
    }
    return keysInA.every((key) => isDeepEqual(a[key], b[key]));
}

export function isElement(el: unknown): el is Element {
    return !!el && el instanceof Element && el.nodeType === Node.ELEMENT_NODE;
}

/**
 * # Is Empty
 * @param value
 */
export function isEmpty(value: any): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    );
}

/**
 * # Is Equal NaN
 *
 * Check if a value is NaN - the only value in JavaScript that is not equal to itself.
 *
 * @param value
 */
export function isEqualNaN(value: unknown): boolean {
    return value !== value;
}

/**
 * # Is Function?
 * @param value
 */
export function isFunction(value: unknown): value is Function {
    return typeof value === "function";
}

/**
 * # Is Number
 * @param value
 */
export function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

/**
 * # Is Object?
 * @param value
 */
export function isObject(value: unknown): value is object {
    return typeof value === "object";
}

/**
 * # Is Object Not Array
 * @param value
 */
export function isObjectNotArray(value: any): boolean {
    return value !== null && isObject(value) && !isArray(value);
}

const isOnPattern = /^on[^a-z]/;
export const isOn = (key: string) => isOnPattern.test(key);

/**
 *
 * @param value
 */
export function isPrimitive(
    value: unknown,
): value is string | number | boolean {
    return Object(value) !== value;
}

/**
 * # Is ShadowRoot
 * @param value
 */
export function isShadowRoot(value: unknown): value is ShadowRoot {
    return typeof ShadowRoot !== "undefined" && value instanceof ShadowRoot;
}

/**
 * # Is String?
 * @param value
 */
export function isString(value: unknown): value is string {
    if (typeof value === "string") {
        return true;
    }
    if (typeof value !== "object") {
        return false;
    }
    try {
        String.prototype.valueOf.call(value);
        return true;
    } catch (e) {
        return false;
    }
}

export function isTypeOf(value: unknown, accept: string[]): boolean {
    return accept.includes(typeof value);
}
