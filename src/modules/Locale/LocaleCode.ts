import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";

/**
 * # Locale Code
 */
export class LocaleCode extends TranslationCode {
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