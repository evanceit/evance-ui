import {isEmpty, omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield/EvTextfield.ts";
import {LocaleManager} from "@/modules/Locale/LocaleManager.ts";
import {PropType, watch} from "vue";

export type NumberFieldModeProp = 'decimal' | 'currency';

export const makeEvNumberFieldProps = propsFactory({
    minFractionDigits: Number,
    maxFractionDigits: Number,
    currency: String,
    currencyDisplay: {
        type: String,
        default: 'narrowSymbol'
    },
    locale: String,
    localeMatcher: String,
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
    showButtons: Boolean,
    step: {
        type: Number,
        default: 1
    },
    useGrouping: Boolean,

    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');


export interface NumberParserProps {
    // Required props
    mode: string;

    // Optional props
    currency?: string;
    currencyDisplay?: string;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    locale?: string;
    localeMatcher?: string;
    min?: number;
    max?: number;
    useGrouping?: boolean;
}


/**
 * # Number Parser
 */
export class NumberParser {

    private _currencyPattern!: RegExp;
    private _decimalPattern!: RegExp;
    private _groupPattern!: RegExp;
    private _minusSignPattern!: RegExp;
    private _numberFormat!: Intl.NumberFormat;
    private _numerals!: string[];
    private _numeralsIndex!: (d: string) => string;
    private _numeralPattern!: RegExp;
    private _prefixPattern!: RegExp;
    private _suffixPattern!: RegExp;

    constructor(
        public localeManager: LocaleManager,
        public props: NumberParserProps
    ) {
        this.cachePatterns();
        this.watchProps();
    }

    private cachePatterns() {
        this._numberFormat = new Intl.NumberFormat(this.locale, this.options);
        this._numerals = this.createNumerals();
        this._numeralsIndex = this.createNumeralsIndex();
        this._numeralPattern = this.createNumeralPattern();
        this._groupPattern = this.createGroupPattern();
        this._minusSignPattern = this.createMinusSignPattern();
        this._currencyPattern = this.createCurrencyPattern();
        this._decimalPattern = this.createDecimalPattern();
        this._suffixPattern = this.createSuffixPattern();
        this._prefixPattern = this.createPrefixPattern();
    }

    get currencyPattern() {
        return this._currencyPattern;
    }

    get decimalPattern() {
        return this._decimalPattern;
    }

    get groupChar(): string {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
        return formatter.format(1000000).trim().replace(this.numeralPattern, '').charAt(0);
    }

    get groupPattern() {
        return this._groupPattern;
    }

    get locale(): string {
        return this.props.locale ?? this.localeManager.currentLocale.value;
    }

    get minusSignPattern() {
        return this._minusSignPattern;
    }

    get numberFormat() {
        return this._numberFormat;
    }

    get numerals() {
        return this._numerals;
    }

    get numeralsIndex() {
        return this._numeralsIndex;
    }

    get numeralPattern() {
        return this._numeralPattern;
    }

    get options(): Intl.NumberFormatOptions {
        return {
            localeMatcher: 'best fit',
            style: this.props.mode,
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay,
            useGrouping: this.props.useGrouping,
            minimumFractionDigits: this.props.minFractionDigits,
            maximumFractionDigits: this.props.maxFractionDigits
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
        return this._prefixPattern;
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
        return this._suffixPattern;
    }

    /**
     * ## Create Currency Pattern
     * @private
     */
    private createCurrencyPattern() {
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

    /**
     * ## Create Decimal Pattern
     * @private
     */
    private createDecimalPattern() {
        const formatter = new Intl.NumberFormat(this.locale, { ...this.options, useGrouping: false });
        return new RegExp(`[${formatter.format(1.1).replace(this.currencyPattern, '').trim().replace(this.numeralPattern, '')}]`, 'g');
    }

    /**
     * ## Create Group Pattern
     * @private
     */
    private createGroupPattern() {
        return new RegExp(`[${this.groupChar}]`, 'g');
    }

    /**
     * ## Create Minus Sign Pattern
     * @private
     */
    private createMinusSignPattern(): RegExp {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
        return new RegExp(`[${formatter.format(-1).trim().replace(this.numeralPattern, '')}]`, 'g');
    }

    /**
     * ## Create Numerals
     * @private
     */
    private createNumerals(): string[] {
        return [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
    }

    /**
     * ## Create Numerals Index
     * @private
     */
    private createNumeralsIndex() {
        const index = new Map(this.numerals.map((d, i) => [d, i]));
        return (d: string) => index.get(d)?.toString() ?? '';
    }

    /**
     * ## Create Numeral Pattern
     * @private
     */
    private createNumeralPattern(): RegExp {
        return new RegExp(`[${this.numerals.join('')}]`, 'g');
    }

    /**
     * ## Create Prefix Pattern
     * @private
     */
    private createPrefixPattern() {
        return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
    }

    /**
     * ## Create Suffix Pattern
     * @private
     */
    private createSuffixPattern() {
        return new RegExp(`${this.escapeRegExp(this.suffixChar || '')}`, 'g');
    }

    /**
     * ## Escape RegExp
     * @param text
     */
    public escapeRegExp(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    /**
     * ## Format Value
     *
     * Converts a number into formatted string.
     *
     * @param value
     */
    public formatValue(value: unknown): string {
        if (isEmpty(value)) {
            return '';
        }
        // Minus sign
        if (value === '-') {
            return value;
        }
        let formatter = new Intl.NumberFormat(this.locale, this.options);
        let formattedValue = formatter.format(value as number);
        // Remove currency symbol - we'll use this in the prefix instead
        return formattedValue;
    }

    /**
     * ## Parse Value
     *
     * Convert a text value into a number.
     *
     * Returns a string when an incomplete value is supplied,
     * or a number when a valid number is parsed successfully
     * from the text supplied, or a `null` value when the number
     * is not valid (can't be parsed).
     *
     * @param text
     */
    public parseValue(text: string | null | undefined): number | string | null {
        if (text === null || text === undefined) {
            text = '';
        }
        let filteredText = text
            .replace(this.suffixPattern, '')
            .replace(this.prefixPattern, '')
            .trim()
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

        let parsedValue;
        const pattern = /^[-+*/.\d\s()]+$/;
        if (pattern.test(filteredText)) {
            try {
                parsedValue = eval(`(${filteredText})`);
            } catch (error) {
                parsedValue = +filteredText;
            }
        } else {
            parsedValue = +filteredText;
        }

        return isNaN(parsedValue) ? null : parsedValue;
    }

    /**
     * ## Watch Props
     * @private
     */
    private watchProps() {
        watch([
            this.localeManager.currentLocale,
            () => this.props.locale,
            () => this.props.localeMatcher,
            () => this.props.mode,
            () => this.props.currency,
            () => this.props.currencyDisplay,
            () => this.props.useGrouping,
            () => this.props.minFractionDigits,
            () => this.props.maxFractionDigits
        ], (value, oldValue) => {
            if (value !== oldValue) {
                this.cachePatterns();
            }
        });
    }
}