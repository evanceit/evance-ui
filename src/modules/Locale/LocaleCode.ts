import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";

/**
 * # Locale Code
 */
export class LocaleCode extends TranslationCode {
    /**
     * @param languageCode
     * @param countryCode
     */
    constructor(
        public languageCode: string,
        public countryCode: string
    ) {
        super(languageCode, countryCode)
    }

    /**
     * ## To Translation Codes
     */
    public toTranslationCodes(): string[] {
        const codes = [
            this.toString()
        ];
        if (this.isRegional) {
            codes.push(this.languageCode);
        }
        return codes;
    }
}