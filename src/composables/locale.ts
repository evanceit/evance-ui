import {inject, InjectionKey} from "vue";
import {LocaleManager, LocaleOptions} from "@/modules/Locale/LocaleManager.ts";
import {TranslationOptions} from "@/modules/Translation/Translator.ts";

/**
 * # Locale Symbol
 */
export const LocaleSymbol: InjectionKey<LocaleManager> = Symbol.for('ev:locale');

/**
 * # Create Locale Manager
 * @todo: we need a lot more settings and options.
 */
export function createLocaleManager(localeOptions: LocaleOptions) {
    return new LocaleManager(localeOptions);
}


/**
 * # Use Locale Manager
 */
export function useLocaleManager(): LocaleManager {
    const localeManager:LocaleManager | undefined = inject(LocaleSymbol);
    if (!localeManager) {
        throw new Error('Evance UI could not find injected locale instance');
    }
    return localeManager;
}

/**
 * # Use Locale Functions
 */
export function useLocaleFunctions() {
    const manager = useLocaleManager();
    return {
        t: (
            reference: string,
            options?: TranslationOptions,
            locale?: string
        ): string | null => {
            return manager.translator.translate(reference, options, locale);
        },
        n: (
            value: number,
            options?: Intl.NumberFormatOptions,
            locale?: string
        ) => {
            return manager.numberFormatter.format(value, options, locale)
        }
    }
}