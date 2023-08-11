import {inject, InjectionKey, Ref} from "vue";

export function createLocale(options?: LocaleOptions & RtlOptions) {
    const i18n = options?.adapter && isLocaleInstance(options?.adapter)
        ? options?.adapter
        : create
}

function isLocaleInstance(obj: any): obj is LocaleInstance {
    return obj.name != null;
}

export interface LocaleInstance {
    name: string;
    messages: Ref<LocaleMessages>;
    current: Ref<string>;
    fallback: Ref<string>;
    t: (key: string, ...params: unknown[]) => string;
    n: (value: number) => string;
    provide: (props: LocaleOptions) => LocaleInstance;
}

export interface LocaleMessages {
    [key: string]: LocaleMessages | string;
}

export interface LocaleOptions {
    messages?: LocaleMessages;
    locale?: string;
    fallback?: string;
    adapter?: LocaleInstance;
}

export const LocaleSymbol: InjectionKey<LocaleInstance & RtlInstance> = Symbol.for('ev:locale');

export interface RtlInstance {
    isRtl: Ref<boolean>;
    rtl: Ref<Record<string, boolean>>;
    rtlClasses: Ref<string>;
}

export interface RtlOptions {
    rtl?: Record<string, boolean>
}

export interface RtlProps {
    rtl?: boolean;
}

/**
 * # Use Locale
 */
export function useLocale() {
    const locale = inject(LocaleSymbol);
}

// @todo: <--- YOU ARE HERE
// Figure out how to provide the new Translator object into a Locale
// Also, maybe more important test how we can use the translator in a story and switch locales to see
// if we can get the translation to change.