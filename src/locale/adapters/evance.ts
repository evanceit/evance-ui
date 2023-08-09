/**
 * Evance pluralisation rules:
 *
 * t(ref, options)
 *
 * options:
 * - key: value dictionary
 * - value
 * - ordinal
 *
 * Example:
 *
 * t('ref.path', {
 *    value: 21,
 *    ordinal: true
 * });
 *
 */
import {createStringTemplate, isNumber} from "@/util";
import {LanguagePack} from "@/modules/Translation/LanguagePack.ts";
import {TranslationOptions} from "@/modules/Translation/Translation.ts";


export function translate(path: string, options: TranslationOptions, languagePack: LanguagePack): string | null {
    const translatable = languagePack.getTranslatable(path);
    if (translatable === null) {
        return null;
    }

    if (translatable.isString) {
        const template = createStringTemplate(translatable.defaultText);
        return template(options);
    }

    // If the translatable is a set of pluralization rules then we expect at least one number value
    if (translatable.isPluralization) {
        // Find the first number in the options
        const keyToPluralize = Object.keys(options).find(key => isNumber(options[key]));
        if (keyToPluralize === undefined) {
            console.error(`Could not find a number to pluralize in translation options for '${path}'.`);
            return null;
        }
        const type = (options.ordinal || false) ? 'ordinal' : 'cardinal';
        const rules = new Intl.PluralRules(translatable.translationCode.toString(), { type });
        const rule = rules.select(options[keyToPluralize]);
        const text = translatable.getText(rule);
        if (text === null) {
            console.error(`Pluralization rule '${rule}' unavailable for '${path}'.`);
            return null;
        }
        const template = createStringTemplate(text);
        return template(options);
    }
    console.error(`Invalid translatable for '${path}'.`);
    return null;
}


