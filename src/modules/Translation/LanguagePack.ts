import {getPropertyValueByPath} from "@/util";
import {Translatable} from "@/modules/Translation/Translatable.ts";

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
        const translationData = getPropertyValueByPath(this.data, reference, null);
        if (!translationData) {
            return null;
        }
        return new Translatable(this.translationCode, reference, translationData);
    }
}

/**
 * # Language Pack Data
 */
export interface LanguagePackData {
    [key: string]: LanguagePackData | string;
}