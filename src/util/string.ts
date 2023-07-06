/**
 * # To Kebab Case
 *
 * Converts a string to `kebab-case` by replacing each space or letter capitalization with a dash (-).
 *
 * @param value
 */
export function toKebabCase (value: string = ''): string {
    if (toKebabCase.cache.has(value)) {
        return toKebabCase.cache.get(value)!;
    }
    const kebabValue = value
        .replace(/[^a-z]/gi, '-')
        .replace(/\B([A-Z])/g, '-$1')
        .toLowerCase();
    toKebabCase.cache.set(value, kebabValue);
    return kebabValue;
}
toKebabCase.cache = new Map<string, string>();