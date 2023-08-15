import {Localized} from "@/modules/Locale/Localized.ts";

/**
 * # Number Formatter
 */
export class NumberFormatter extends Localized {
    public format(
        value: number,
        options?: Intl.NumberFormatOptions,
        locale?: string = null
    ) {
        if (!locale) {
            locale = this.currentLocale.value ?? this.defaultLocale.value;
        }
        const numberFormat = new Intl.NumberFormat(this.getTranslationCodes(locale), options);
        return numberFormat.format(value);
    }
}