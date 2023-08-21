/**
 * # Validation Function
 */
export type ValidationFunction = (value: any) => true | string;

/**
 * # Form Field
 */
export class Field {

    private validators: ValidationFunction[] = [];

    private messages: string[];

    constructor(
        public name: string
    ) { }

    /**
     * ## Add Message
     *
     * Add one or more validation messages to the field.
     *
     * @param message
     */
    public addMessage(...message: string[]) {
        this.messages.push(...message);
    }

    /**
     * ## Add Validator
     *
     * Add one or more validation functions to the field.
     *
     * @param validator
     */
    public addValidator(...validator: ValidationFunction[]) {
        this.validators.push(...validator);
    }

    public hasMessages(): boolean {
        return !!this.messages.length;
    }

    public reset() {
        this.messages = [];
    }

    public validate(value) {
        this.reset();
        for (const validationFn of this.validators) {
            const result = validationFn(value);
            if (result !== true) {
                this.addMessage(result);
            }
        }
    }
}