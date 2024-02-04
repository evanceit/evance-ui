import {DateAdapter} from "@/composables/date/DateAdapter.ts";
import {createRange, isFunction, isString, padStart} from "@/util";
import {LocaleCode} from "@/modules/Locale/LocaleCode.ts";

type CustomDateFormat = Intl.DateTimeFormatOptions | ((date: Date, formatString: string, locale: string) => string);

/**
 * # Default Date Adapter
 */
export class DefaultDateAdapter implements DateAdapter<Date> {

    protected static readonly PATTERN_ISO = /([12]\d{3}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12]\d|3[01]))/;
    protected static readonly firstDayOfWeek: Record<string, number> = {
        '001': 1,
        AD: 1,
        AE: 6,
        AF: 6,
        AG: 0,
        AI: 1,
        AL: 1,
        AM: 1,
        AN: 1,
        AR: 1,
        AS: 0,
        AT: 1,
        AU: 1,
        AX: 1,
        AZ: 1,
        BA: 1,
        BD: 0,
        BE: 1,
        BG: 1,
        BH: 6,
        BM: 1,
        BN: 1,
        BR: 0,
        BS: 0,
        BT: 0,
        BW: 0,
        BY: 1,
        BZ: 0,
        CA: 0,
        CH: 1,
        CL: 1,
        CM: 1,
        CN: 1,
        CO: 0,
        CR: 1,
        CY: 1,
        CZ: 1,
        DE: 1,
        DJ: 6,
        DK: 1,
        DM: 0,
        DO: 0,
        DZ: 6,
        EC: 1,
        EE: 1,
        EG: 6,
        ES: 1,
        ET: 0,
        FI: 1,
        FJ: 1,
        FO: 1,
        FR: 1,
        GB: 1,
        GE: 1,
        GF: 1,
        GP: 1,
        GR: 1,
        GT: 0,
        GU: 0,
        HK: 0,
        HN: 0,
        HR: 1,
        HU: 1,
        ID: 0,
        IE: 1,
        IL: 0,
        IN: 0,
        IQ: 6,
        IR: 6,
        IS: 1,
        IT: 1,
        JM: 0,
        JO: 6,
        JP: 0,
        KE: 0,
        KG: 1,
        KH: 0,
        KR: 0,
        KW: 6,
        KZ: 1,
        LA: 0,
        LB: 1,
        LI: 1,
        LK: 1,
        LT: 1,
        LU: 1,
        LV: 1,
        LY: 6,
        MC: 1,
        MD: 1,
        ME: 1,
        MH: 0,
        MK: 1,
        MM: 0,
        MN: 1,
        MO: 0,
        MQ: 1,
        MT: 0,
        MV: 5,
        MX: 0,
        MY: 1,
        MZ: 0,
        NI: 0,
        NL: 1,
        NO: 1,
        NP: 0,
        NZ: 1,
        OM: 6,
        PA: 0,
        PE: 0,
        PH: 0,
        PK: 0,
        PL: 1,
        PR: 0,
        PT: 0,
        PY: 0,
        QA: 6,
        RE: 1,
        RO: 1,
        RS: 1,
        RU: 1,
        SA: 0,
        SD: 6,
        SE: 1,
        SG: 0,
        SI: 1,
        SK: 1,
        SM: 1,
        SV: 0,
        SY: 6,
        TH: 0,
        TJ: 1,
        TM: 1,
        TR: 1,
        TT: 0,
        TW: 0,
        UA: 1,
        UM: 0,
        US: 0,
        UY: 1,
        UZ: 1,
        VA: 1,
        VE: 0,
        VI: 0,
        VN: 1,
        WS: 0,
        XK: 1,
        YE: 0,
        ZA: 0,
        ZW: 0,
    };
    protected static readonly formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
        'fullDateWithWeekday': { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
        'normalDateWithWeekday': { weekday: 'short', day: 'numeric', month: 'short' },
        'keyboardDate': { day: '2-digit', month: '2-digit', year: 'numeric' },
        'monthAndDate': { month: 'long', day: 'numeric' },
        'monthAndYear': { month: 'long', year: 'numeric' },
        'month': { month: 'long' },
        'monthShort': { month: 'short' },
        'dayOfMonth': { day: 'numeric' },
        'shortDate': { year: '2-digit', month: 'numeric', day: 'numeric' },
        'year': { year: 'numeric' },
        'displayDate': { day: '2-digit', month: 'short', year: 'numeric' }
    };

    public locale: string;
    public formats?: Record<string, CustomDateFormat>;

    /**
     * @param options
     */
    constructor(options: { locale: string, formats?: Record<string, CustomDateFormat> }) {
        this.locale = options.locale;
        this.formats = options.formats;
    }

    /**
     * ## Add Days
     * @param date
     * @param amount
     */
    public addDays(date: Date, amount: number): Date {
        const d = new Date(date);
        d.setDate(d.getDate() + amount);
        return d;
    }

    /**
     * ## Add Months
     * @param date
     * @param amount
     */
    public addMonths(date: Date, amount: number): Date {
        const d = new Date(date);
        d.setMonth(d.getMonth() + amount);
        return d;
    }

    /**
     * ## Date
     * @param value
     */
    public date(value?: any) {
        if (value == null) {
            return new Date();
        }
        if (value instanceof Date) {
            return value;
        }
        if (isString(value)) {
            if (this.isISO(value)) {
                return this.parseISO(value);
            }
            const parsed = Date.parse(value);
            if (!isNaN(parsed)) {
                return new Date(parsed);
            }
        }
        return null;
    }

    /**
     * ## End of Day
     * @param date
     */
    public endOfDay(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    }

    /**
     * ## End of Month
     * @param date
     */
    public endOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    /**
     * ## End of Year
     * @param date
     */
    public endOfYear(date: Date): Date {
        return new Date(date.getFullYear(), 11, 31);
    }

    /**
     * ## Format
     * @param date
     * @param formatString
     */
    public format(date: Date, formatString: string): string {
        const newDate = this.date(date) ?? new Date();
        const customFormat = this.formats?.[formatString];
        if (isFunction(customFormat)) {
            return customFormat(newDate, formatString, this.locale);
        }
        const options: Intl.DateTimeFormatOptions = DefaultDateAdapter.formatOptions[formatString] || (customFormat ?? { timeZone: 'UTC', timeZoneName: 'short' });
        return new Intl.DateTimeFormat(this.locale, options).format(newDate);
    }

    /**
     * ## Get Country Code
     * Returns the country code portion of the locale code.
     * @private
     */
    private getCountryCode(): string {
        return LocaleCode.fromString(this.locale).countryCode!;
    }

    /**
     * ## Get Diff
     * @param date
     * @param comparing
     * @param unit
     */
    public getDiff(date: Date, comparing: string | Date, unit?: string): number {
        const d = new Date(date);
        const c = new Date(comparing);
        if (unit === 'month') {
            return d.getMonth() - c.getMonth() + ((d.getFullYear() - c.getFullYear()) * 12);
        }
        return Math.floor((d.getTime() - c.getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * ## Get First Day of Week
     * @private
     */
    private getFirstDayOfWeek(): number {
        return DefaultDateAdapter.firstDayOfWeek[this.getCountryCode()] ?? 1;
    }

    /**
     * ## Get Month
     * @param date
     */
    public getMonth(date: Date): number {
        return date.getMonth();
    }

    /**
     * ## Get Next Month
     * @param date
     */
    public getNextMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    /**
     * ## Get Week Array
     * @param date
     */
    public getWeekArray(date: Date): Date[][] {
        const weeks = [];
        let currentWeek = [];
        const firstDayOfMonth = this.startOfMonth(date);
        const lastDayOfMonth = this.endOfMonth(date);
        const firstDayWeekIndex = (firstDayOfMonth.getDay() - this.getFirstDayOfWeek() + 7) % 7;
        const lastDayWeekIndex = (lastDayOfMonth.getDay() - this.getFirstDayOfWeek() + 7) % 7;

        for (let i = 0; i < firstDayWeekIndex; i++) {
            const adjacentDay = new Date(firstDayOfMonth);
            adjacentDay.setDate(adjacentDay.getDate() - (firstDayWeekIndex - i));
            currentWeek.push(adjacentDay);
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const day = new Date(date.getFullYear(), date.getMonth(), i);

            // Add the day to the current week
            currentWeek.push(day);

            // If the current week has 7 days, add it to the weeks array and start a new week
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        for (let i = 1; i < 7 - lastDayWeekIndex; i++) {
            const adjacentDay = new Date(lastDayOfMonth);
            adjacentDay.setDate(adjacentDay.getDate() + i);
            currentWeek.push(adjacentDay);
        }

        weeks.push(currentWeek);

        return weeks;
    }

    /**
     * ## Get Weekdays
     */
    public getWeekdays(): string[] {
        const firstSundayOf2023 = new Date(2023, 0, 1);
        const daysFromSunday = this.getFirstDayOfWeek();
        return createRange(7).map(index => {
            // Start with a known Sunday (2023-01-01)
            const weekday = new Date(firstSundayOf2023);
            weekday.setDate(firstSundayOf2023.getDate() + daysFromSunday + index);
            return new Intl.DateTimeFormat(this.locale, {
                weekday: 'narrow'
            }).format(weekday);
        });
    }

    /**
     * ## Get Year
     * @param date
     */
    public getYear(date: Date): number {
        return date.getFullYear();
    }

    /**
     * ## Is After
     * @param date
     * @param comparing
     */
    public isAfter(date: Date, comparing: Date): boolean {
        return date.getTime() > comparing.getTime();
    }

    /**
     * ## Is Before
     * @param date
     * @param comparing
     */
    public isBefore(date: Date, comparing: Date): boolean {
        return date.getTime() < comparing.getTime();
    }

    /**
     * ## Is Equal
     * @param date
     * @param comparing
     */
    public isEqual(date: Date, comparing: Date): boolean {
        return date.getTime() === comparing.getTime();
    }

    /**
     * ## Is ISO?
     * @param value
     * @protected
     */
    protected isISO(value: string): boolean {
        return DefaultDateAdapter.PATTERN_ISO.test(value);
    }

    /**
     * ## Is Same Day
     * @param date
     * @param comparing
     */
    public isSameDay(date: Date, comparing: Date): boolean {
        return (
            date.getDate() === comparing.getDate()
            && date.getMonth() === comparing.getMonth()
            && date.getFullYear() === comparing.getFullYear()
        );
    }

    /**
     * ## Is Same Month
     * @param date
     * @param comparing
     */
    public isSameMonth(date: Date, comparing: Date): boolean {
        return (
            date.getMonth() === comparing.getMonth()
            && date.getFullYear() === comparing.getFullYear()
        );
    }

    /**
     * ## Is Valid
     * @param date
     */
    public isValid(date: any): boolean {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
    }

    /**
     * ## Is Within Range
     * @param date
     * @param range
     */
    public isWithinRange(date: Date, range: [Date, Date]): boolean {
        return (
            this.isAfter(date, range[0])
            && this.isBefore(date, range[1])
        );
    }

    /**
     * ## Parse YYYY-MM-DD strings
     *
     * Uses local time zone when passing individual date component values.
     *
     * @param value
     * @protected
     */
    public parseISO(value: string): Date {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * ## Set Month
     * @param date
     * @param month
     */
    public setMonth(date: Date, month: number): Date {
        const d = new Date(date);
        d.setMonth(month);
        return d;
    }

    /**
     * ## Set Year
     * @param date
     * @param year
     */
    public setYear(date: Date, year: number) {
        const d = new Date(date);
        d.setFullYear(year);
        return d;
    }

    /**
     * ## Start of Day
     * @param date
     */
    public startOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    /**
     * ## Start of Month
     * @param date
     */
    public startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    /**
     * ## Start of Year
     * @param date
     */
    public startOfYear(date: Date): Date {
        return new Date(date.getFullYear(), 0, 1);
    }

    /**
     * ## To ISO
     * @param date
     */
    public toISO(date: Date): string {
        const year = date.getFullYear();
        const month = padStart(String(date.getMonth() + 1), 2, '0');
        const day = padStart(String(date.getDate()), 2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * ## To JS Date
     * @param value
     */
    public toJsDate(value: Date): Date {
        return value;
    }
}