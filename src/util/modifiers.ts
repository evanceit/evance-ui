import {isString, toKebabCase} from "../util";


/**
 * ## Make Class Name
 * Accepts a string `value` and a `prefix` to be combined and separated by a dash ("-").
 * The value will be converted into "kebab-case".
 * @param value
 * @param prefix
 * @param exclude
 */
export function makeClassName(value?: string, prefix: string = '', exclude: (string | RegExp)[] = []): string | undefined {
    if (
        !value
        || exclude.some((exclusion) => {
            if (exclusion instanceof RegExp) {
                return exclusion.test(value);
            }
            return value === exclusion;
        })
    ) {
        return undefined;
    }
    const kebabValue = toKebabCase(value);
    return `${prefix}-${kebabValue}`;
}

/**
 * ## Make a Size Modifier Class Name
 * @param value
 * @param exclude
 */
export function sizeModifier(value?: string | number, exclude: (string | RegExp)[] = []): string | undefined {
    if (!isString(value)) {
        return undefined;
    }
    return makeClassName(value, 'is-size', exclude);
}

/**
 * ## Make an Appearance Modifier Class Name
 * @param value
 * @param exclude
 */
export function appearanceModifier(value: string, exclude: (string | RegExp)[] = []): string | undefined {
    return makeClassName(value, 'is-appearance', exclude);
}