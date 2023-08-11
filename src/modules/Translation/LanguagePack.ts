import * as fs from "fs";
import {getPropertyValueByPath, isString} from "@/util";
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

    /**
     * # Import
     *
     * Load a language pack from a JavaScript or TypeScript source file.
     *
     * @param filePath
     */
    public async import(filePath: string) {
        if (!fs.existsSync(filePath)) {
            return false;
        }
        try {
            const module = await import(filePath);
            this.data = module.default || {};
            return true;
        } catch (error) {
            return false;
        }
    }
}

/**
 * # Language Pack Data
 */
export interface LanguagePackData {
    [key: string]: LanguagePackData | string;
}