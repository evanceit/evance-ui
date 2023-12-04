import {isEmpty, omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield/EvTextfield.ts";
import {LocaleManager} from "@/modules/Locale/LocaleManager.ts";
import {PropType} from "vue";

export type NumberFieldModeProp = 'decimal' | 'currency';

export const makeEvNumberFieldProps = propsFactory({
    decimalPlacesMin: Number,
    decimalPlacesMax: Number,
    min: {
        type: Number,
        default: undefined
    },
    max: {
        type: Number,
        default: undefined
    },
    mode: {
        type: String as PropType<NumberFieldModeProp>,
        default: 'decimal'
    },
    step: {
        type: Number,
        default: 1
    },

    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');


export interface NumberParserProps {
    // Required props
    mode: string;

    // Optional props
    decimalPlacesMin?: number;
    decimalPlacesMax?: number;
    min?: number;
    max?: number;
    currency?: string;
    currencyDisplay?: string;
    locale?: string;
    useGrouping?: boolean;
}

export class NumberParser {

    constructor(
        public localeManager: LocaleManager,
        public props: NumberParserProps
    ) {}

    get currencyPattern() {
        if (!this.props.currency) {
            return new RegExp(`[]`, 'g');
        }
        const options = {
            style: 'currency',
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };
        const formatter = new Intl.NumberFormat(this.locale, options);
        return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(this.numeralPattern, '').replace(this.groupPattern, '')}]`, 'g');
    }

    get decimalPattern() {
        const formatter = new Intl.NumberFormat(this.locale, { ...this.options, useGrouping: false });
        return new RegExp(`[${formatter.format(1.1).replace(this.currencyPattern, '').trim().replace(this.numeralPattern, '')}]`, 'g');
    }

    get groupChar(): string {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
        return formatter.format(1000000).trim().replace(this.numeralPattern, '').charAt(0);
    }

    get groupPattern() {
        return new RegExp(`[${this.groupChar}]`, 'g');
    }

    get locale(): string {
        return this.props.locale ?? this.localeManager.currentLocale.value;
    }

    get minusSignPattern() {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
        return new RegExp(`[${formatter.format(-1).trim().replace(this.numeralPattern, '')}]`, 'g');
    }

    get numeralPattern() {
        return new RegExp(`[${this.numerals.join('')}]`, 'g');
    }

    get numerals(): string[] {
        return [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
    }

    get numeralsIndex() {
        const index = new Map(this.numerals.map((d, i) => [d, i]));
        return (d: string) => index.get(d);
    }

    get options(): Intl.NumberFormatOptions {
        return {
            localeMatcher: 'best fit',
            style: 'decimal',
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay,
            useGrouping: this.props.useGrouping,
            minimumFractionDigits: this.props.decimalPlacesMin,
            maximumFractionDigits: this.props.decimalPlacesMax
        };
    }

    get prefixChar() {
        const options = {
            style: this.props.mode,
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay
        };
        const formatter = new Intl.NumberFormat(this.locale, options);
        return formatter.format(1).split('1')[0];
    }

    get prefixPattern() {
        return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
    }

    get suffixChar() {
        const options = {
            style: this.props.mode,
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };
        const formatter = new Intl.NumberFormat(this.locale, options);
        return formatter.format(1).split('1')[1];
    }

    get suffixPattern() {
        return new RegExp(`${this.escapeRegExp(this.suffixChar || '')}`, 'g');
    }

    public escapeRegExp(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    public formatValue(value) {
        if (isEmpty(value)) {
            return '';
        }
        // Minus sign
        if (value === '-') {
            return value;
        }
        let formatter = new Intl.NumberFormat(this.locale, this.options);
        return formatter.format(value);
    }

    public parseValue(text) {
        let filteredText = text
            .replace(this.suffixPattern, '')
            .replace(this.prefixPattern, '')
            .trim()
            .replace(/\s/g, '')
            .replace(this.currencyPattern, '')
            .replace(this.groupPattern, '')
            .replace(this.minusSignPattern, '-')
            .replace(this.decimalPattern, '.')
            .replace(this.numeralPattern, this.numeralsIndex);

        if (!filteredText) {
            return null;
        }
        if (filteredText === '-') {
            return filteredText;
        }
        let parsedValue = +filteredText;
        return isNaN(parsedValue) ? null : parsedValue;
    }
}