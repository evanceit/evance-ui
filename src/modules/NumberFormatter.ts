import {Localized} from "@/modules/Locale/Localized.ts";

/**
 * # Number Formatter
 */
export class NumberFormatter extends Localized {

    public format(
        value: number,
        options?: Intl.NumberFormatOptions,
        locale?: string
    ) {
        return this.formatter(options, locale).format(value);
    }

    public formatter(options?: Intl.NumberFormatOptions, locale?: string) {
        if (!locale) {
            locale = this.currentLocale.value ?? this.defaultLocale.value;
        }
        return new Intl.NumberFormat(this.getTranslationCodes(locale), options);
    }
}