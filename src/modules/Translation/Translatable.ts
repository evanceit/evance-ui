import {isPluralizationRules, PluralizationRuleKey, PluralizationRules} from "@/modules/Translation/Pluralization.ts";
import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";

/**
 * # Translatable
 */
export class Translatable {

    constructor(
        public data: string | PluralizationRules,
        public translationCode: TranslationCode
    ) {}

    get defaultText(): string | null {
        if (this.isString) {
            return this.data;
        }
        return this.getText('other');
    }

    get isString(): boolean {
        return typeof this.data === 'string';
    }

    get isPluralization(): boolean {
        return isPluralizationRules(this.data);
    }

    public getText(rule: PluralizationRuleKey): string | null {
        if (this.isString) {
            return this.data;
        }
        const value = this.data[rule] ?? null;
        return (value === null) ? (this.data['other'] ?? null) : value;
    }
}