import {isPluralizationRules, PluralizationRuleKey, PluralizationRules} from "@/modules/Translation/Pluralization.ts";
import {TranslationOptions} from "@/modules/Translation/Translator.ts";
import {createStringTemplate, isNumber, TemplateVariables} from "@/util";

/**
 * # Translatable
 */
export class Translatable {

    constructor(
        public translationCode: string,
        public reference: string,
        public data: string | PluralizationRules
    ) {}

    get defaultText(): string {
        if (typeof this.data === 'string') {
            return this.data;
        }
        return this.getText('other') ?? '';
    }

    get isString(): boolean {
        return typeof this.data === 'string';
    }

    get isPluralization(): boolean {
        return isPluralizationRules(this.data);
    }

    public getText(rule: PluralizationRuleKey): string | null {
        if (typeof this.data === 'string') {
            return this.data;
        }
        const value = this.data[rule] ?? null;
        return (value === null) ? (this.data['other'] ?? null) : value;
    }

    /**
     * ## Translate
     * @param options
     */
    public translate(options: TranslationOptions = {}): string | undefined {
        if (this.isString) {
            return createStringTemplate(this.defaultText, options as TemplateVariables)();
        }
        // If the translatable is a set of pluralization rules then we expect at least one number value
        if (this.isPluralization) {
            // Find the first number in the options
            const keyToPluralize = Object.keys(options).find(key => isNumber(options[key]));
            if (keyToPluralize === undefined) {
                console.error(`Could not find a number to pluralize in translation options for '${this.reference}'.`);
                return undefined;
            }
            const rules = new Intl.PluralRules(this.translationCode, {
                type: (options.ordinal || false) ? 'ordinal' : 'cardinal'
            });
            const rule = rules.select(options[keyToPluralize] as number);
            const text = this.getText(rule);
            if (text === null) {
                console.error(`Pluralization rule '${rule}' or 'other' unavailable for '${this.reference}'.`);
                return undefined;
            }
            return createStringTemplate(text, options as TemplateVariables)();
        }
        console.error(`Invalid translatable for '${this.reference}'.`);
        return undefined;
    }
}