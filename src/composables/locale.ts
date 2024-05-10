import { inject, InjectionKey, shallowRef } from "vue";
import {
    LocaleManager,
    LocaleOptions,
} from "@/modules/Locale/LocaleManager.ts";
import { TranslationVariables } from "@/modules/Translation/Translator.ts";

/**
 * # Locale Symbol
 */
export const LocaleSymbol: InjectionKey<LocaleManager> =
    Symbol.for("ev:locale");

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
    const localeManager: LocaleManager | undefined = inject(LocaleSymbol);
    if (!localeManager) {
        throw new Error("Evance UI: Could not find injected locale instance.");
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
            variables?: TranslationVariables,
            locale?: string,
        ): string | undefined => {
            return manager.translator.translate(reference, variables, locale);
        },
        n: (
            value: number,
            options?: Intl.NumberFormatOptions,
            locale?: string,
        ) => {
            return manager.numberFormatter.format(value, options, locale);
        },
    };
}

/**
 *
 */
export function useRtl() {
    // @todo: Implement RTL in Locale Manager
    const isRtl = shallowRef(false);
    const rtlClasses = shallowRef([]);
    return {
        isRtl,
        rtlClasses,
    };
}
