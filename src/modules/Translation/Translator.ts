import {LanguagePack} from "@/modules/Translation/LanguagePack.ts";
import {Translatable} from "@/modules/Translation/Translatable.ts";
import {LocaleCode} from "@/modules/Locale/LocaleCode.ts";
import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";
import {createStringTemplate} from "@/util";

/**
 * # Translation Options
 *
 * When requesting a translation you may supply an object with keys matching
 * the variable names of the string template within a Language Pack.
 *
 * The only reserved key term is `ordinal`, which is reserved for telling the
 * translator that we should expect an ordinal, not a cardinal translation
 * from a pluralization rule set.
 *
 */
export interface TranslationOptions {
    [key: string | number]: string | number;
    ordinal: boolean;
}


/**
 * # Translator
 */
export class Translator {

    private defaultLocale: LocaleCode;

    private languagePacks: LanguagePack[] = [];

    private translatables: Map<string, Translatable> = new Map();

    constructor(defaultLocale: LocaleCode) {
        this.defaultLocale = defaultLocale;
    }

    /**
     * ## Add Language Pack
     *
     * The new language pack is added to the beginning of the array of available language packs.
     * This makes it possible for subsequent language packs to override references.
     *
     * @param languagePack
     */
    public addLanguagePack(languagePack: LanguagePack): void {
        this.languagePacks.unshift(languagePack);
    }

    /**
     * ## Get Closest Translatable
     *
     * Returns the closest available translatable object matching the reference supplied across all
     * language packs matching translation codes from the locale, or the default.
     *
     * For example if a locale was supplied of "de-de", and our default translations were in "en",
     * then we would search for language packs "de-de", "de" and "en" in sequence.
     *
     * @param locale
     * @param reference
     */
    public getClosestTranslatable(locale: LocaleCode, reference: string): Translatable | null {

        const translatableKey = `${locale.toString()}:${reference}`;

        if (this.translatables.has(translatableKey)) {
            return this.translatables.get(translatableKey);
        }

        const translationCodes = this.getTranslationCodes(locale);
        for (const translationCode of translationCodes) {
            const translatable = this.getTranslatable(translationCode, reference);
            if (translatable) {
                this.translatables.set(translatableKey, translatable);
                return translatable;
            }
        }
        return null;
    }

    /**
     * # Get Language Packs
     *
     * Returns the all available language pack matching the translation code.
     *
     * @param translationCode
     */
    public getLanguagePacks(translationCode: TranslationCode): LanguagePack[] {
        return this.languagePacks.filter((languagePack) => {
            return (languagePack.translationCode.toString() === translationCode.toString());
        });
    }

    /**
     * ## Get Translatable
     *
     * Returns a translatable item from a language pack matching the supplied translation code.
     * Returns `null` if either the language pack is unavailable, or if the
     *
     * @param translationCode
     * @param reference
     */
    public getTranslatable(translationCode: TranslationCode, reference: string): Translatable | null {
        const packs = this.getLanguagePacks(translationCode);
        for (const pack of packs) {
            const translatable = pack.getTranslatable(reference);
            if (translatable) {
                return translatable;
            }
        }
        return null;
    }

    /**
     * ## Get Translation Codes
     *
     * Returns all the translation codes for the Locale we should use when getting a translatable.
     * This includes a fallback to our default TranslationCode.
     *
     * @param locale
     */
    public getTranslationCodes(locale: LocaleCode): TranslationCode[] {
        const translationCodes = locale.toTranslationCodes();
        // Add our default if it is not in the list
        if (!translationCodes.find((code) => (code.toString() === this.defaultLocale.toString()))) {
            translationCodes.push(this.defaultLocale);
        }
        return translationCodes;
    }

    /**
     * ## Translate
     *
     * @param locale
     * @param reference
     * @param options
     */
    public translate(
        locale: LocaleCode,
        reference: string,
        options?: TranslationOptions = {}
    ): string | null {
        const translatable = this.getClosestTranslatable(locale, reference);
        return translatable?.translate(options) || null;
    }
}