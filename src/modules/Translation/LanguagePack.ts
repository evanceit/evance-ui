import {getPropertyValueByPath} from "@/util";
import {Translatable} from "@/modules/Translation/Translatable.ts";
import {PluralizationRules} from "@/modules/Translation/Pluralization.ts";

/**
 * # Language Pack
 */
export class LanguagePack {
    /**
     * @param translationCode
     * @param data
     */
    constructor(
        public translationCode: string,
        public data: LanguagePackData = {}
    ) {}

    /**
     * ## Get Translatable
     * @param reference
     */
    public getTranslatable(reference: string): Translatable | null {
        try {
            const translationData = getPropertyValueByPath(this.data, reference, null);
            if (!translationData) {
                return null;
            }
            return new Translatable(this.translationCode, reference, translationData);
        } catch (e) {
            return null;
        }
    }
}

/**
 * # Language Pack Data
 */
export interface LanguagePackData {
    [key: string]: LanguagePackData | PluralizationRules | string;
}