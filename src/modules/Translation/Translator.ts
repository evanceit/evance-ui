import {LanguagePack, LanguagePackData} from "@/modules/Translation/LanguagePack.ts";
import {Translatable} from "@/modules/Translation/Translatable.ts";
import {Localized} from "@/modules/Locale/Localized.ts";

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
export class Translator extends Localized {

    private languagePacks: LanguagePack[] = [];

    private translatables: Map<string, Translatable> = new Map();

    /**
     * ## Add Language Pack
     *
     * The new language pack is added to the beginning of the array of available language packs.
     * This makes it possible for subsequent language packs to override references.
     *
     * @param locale
     * @param messages
     */
    public addLanguagePack(locale: string, messages: LanguagePackData): void {
        this.languagePacks.unshift(new LanguagePack(locale, messages));
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
    private getClosestTranslatable(locale: string, reference: string): Translatable | null {

        const translatableKey = `${locale}:${reference}`;

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
     * ## Get Language Packs
     */
    public getLanguagePacks(): LanguagePack[] {
        return this.languagePacks;
    }

    /**
     * # Get Language Packs for TranslationCode
     *
     * Returns the all available language pack matching the translation code.
     *
     * @param translationCode
     */
    private getLanguagePacksForTranslationCode(translationCode: string): LanguagePack[] {
        return this.languagePacks.filter((languagePack) => {
            return (languagePack.translationCode === translationCode);
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
    private getTranslatable(translationCode: string, reference: string): Translatable | null {
        const packs = this.getLanguagePacksForTranslationCode(translationCode);
        for (const pack of packs) {
            const translatable = pack.getTranslatable(reference);
            if (translatable) {
                return translatable;
            }
        }
        return null;
    }

    /**
     * ## Translate
     *
     * @param locale
     * @param reference
     * @param options
     */
    public translate(
        reference: string,
        options?: TranslationOptions = {},
        locale?: string = null
    ): string | null {
        if (!locale) {
            locale = this.currentLocale.value ?? this.defaultLocale.value;
        }
        const translatable = this.getClosestTranslatable(locale, reference);
        return translatable?.translate(options) || null;
    }
}