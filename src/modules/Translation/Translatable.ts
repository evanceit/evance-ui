import {isPluralizationRules, PluralizationRuleKey, PluralizationRules} from "@/modules/Translation/Pluralization.ts";
import {TranslationVariables} from "@/modules/Translation/Translator.ts";
import {createStringTemplate, isNumber, isString, TemplateVariables} from "@/util";

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
        return isString(this.data);
    }

    get isPluralization() {
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
     * @param variables
     */
    public translate(variables: TranslationVariables = {}): string | undefined {
        if (isString(this.data)) {
            return createStringTemplate(this.defaultText, variables as TemplateVariables)();
        }
        // If the translatable is a set of pluralization rules then we expect at least one number value
        if (isPluralizationRules(this.data)) {
            // Find the first number in the options
            const keyToPluralize = Object.keys(variables).find(key => isNumber(variables[key]));
            if (keyToPluralize === undefined) {
                console.error(`Could not find a number to pluralize in translation options for '${this.reference}'.`);
                return undefined;
            }
            const rules = new Intl.PluralRules(this.translationCode, {
                type: (this.data.ordinal || false) ? 'ordinal' : 'cardinal'
            });
            const rule = rules.select(variables[keyToPluralize] as number);
            const text = this.getText(rule);
            if (text === null) {
                console.error(`Pluralization rule '${rule}' or 'other' unavailable for '${this.reference}'.`);
                return undefined;
            }
            return createStringTemplate(text, variables as TemplateVariables)();
        }
        console.error(`Invalid translatable for '${this.reference}'.`);
        return undefined;
    }
}