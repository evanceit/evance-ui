import { Ref } from "vue/dist/vue";
import { LocaleCode } from "@/modules/Locale/LocaleCode.ts";

/**
 * # Localized
 */
export class Localized {
    /**
     * @param defaultLocale
     * @param currentLocale
     */
    constructor(
        public readonly defaultLocale: Ref<string>,
        public readonly currentLocale: Ref<string>,
    ) {}

    /**
     * ## Get Translation Codes
     *
     * Returns all the translation codes for the Locale we should use when getting a translatable.
     * This includes a fallback to our default TranslationCode.
     *
     * @param locale
     */
    public getTranslationCodes(locale: string): string[] {
        const localeCode = LocaleCode.fromString(locale) as LocaleCode;
        const translationCodes = localeCode.toTranslationCodes();
        // Add our default if it is not in the list
        if (
            !translationCodes.find(
                (code: string) => code === this.defaultLocale.value,
            )
        ) {
            translationCodes.push(this.defaultLocale.value);
        }
        return translationCodes;
    }

    /**
     * ## Set Current Locale
     *
     * Set the current locale so that we don't have to use it in each translate call,
     * unless we want to.
     *
     * @param locale
     */
    public setCurrentLocale(locale: string): void {
        this.currentLocale.value = locale;
    }

    /**
     * ## Set Default Locale
     *
     * The default locale to use if translations are unavailable for the current locale.
     *
     * @param locale
     */
    public setDefaultLocale(locale: string): void {
        this.defaultLocale.value = locale;
    }
}
