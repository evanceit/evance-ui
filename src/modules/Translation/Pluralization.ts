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
    [K in PluralizationRuleKey]: string;
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
export function isPluralizationRules(value: any): value is PluralizationRules {
    if (isObject(value)) {
        return Object.entries(value).every(([key, val]) => {
            return isPluralizationKey(key) && isString(val);
        });
    }
    return false;
}