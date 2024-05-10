/**
 * # Translation Code
 *
 * Language Code: ISO 639-1 codes (required)
 * Country Code: ISO 3166-1 Alpha-2 country code (optional)
 */
export class TranslationCode {
    /**
     * @param languageCode
     * @param countryCode
     */
    constructor(
        public languageCode: string,
        public countryCode: string | null = null,
    ) {}

    get isRegional(): boolean {
        return !(this.countryCode === null);
    }

    /**
     * ## From String
     *
     * Accepts an Evance Locale Code string e.g. 'en-gb'.
     * But will also accept 'en_GB'.
     * @param code
     */
    public static fromString(code: string) {
        const matches = code.match(/^([a-zA-Z]{2,3})(?:[_-]([a-zA-Z]{2,3}))?$/);
        if (!matches) {
            throw new Error(
                `Evance UI: The string '${code}' is not a valid Locale string`,
            );
        }
        const languageCode = matches[1].toLowerCase();
        const countryCode = matches[2]?.toUpperCase() || null;
        return new this(languageCode, countryCode);
    }

    /**
     * ## To String
     */
    public toString(): string {
        return (
            this.languageCode + (this.isRegional ? "-" + this.countryCode : "")
        );
    }
}
