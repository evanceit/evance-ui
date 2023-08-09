import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";

/**
 * # Locale Code
 */
export class LocaleCode extends TranslationCode {

    /**
     * ## To Translation Codes
     */
    public toTranslationCodes(): TranslationCode[] {
        const codes = [
            new TranslationCode(this.languageCode, this.countryCode)
        ];
        if (this.isRegional) {
            codes.push(new TranslationCode(this.languageCode, null));
        }
        return codes;
    }
}