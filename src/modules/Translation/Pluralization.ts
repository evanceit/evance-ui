import {isObject, isString} from "@/util";

/**
 * # Pluralization
 *
 * Pluralization supports cardinal and ordinal values.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
 */
export const pluralizationRuleKeys = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;

export type PluralizationRuleKey = typeof pluralizationRuleKeys[number];

export type PluralizationRules = {
    [key: PluralizationRuleKey]: string;
};


/**
 * ## Is Pluralization Key
 *
 * Determines whether the value supplied represents a valid pluralization rule key.
 *
 * @param key
 */
export function isPluralizationKey(key: any): key is PluralizationRuleKey {
    return pluralizationRuleKeys.includes(key);
}


/**
 * # Is Pluralization Rules
 *
 * Determines whether a value contains an object with pluralization rules within it.
 *
 * @param value
 */
export function isPluralizationRules(value: any): translatable is PluralizationRules {
    if (!isObject(value) || value === null) {
        return false;
    }
    const keys = Object.keys(value);
    return keys.every(key => isPluralizationKey(key) && isString(value[key]));
}