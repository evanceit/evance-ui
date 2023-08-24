import {Ref, ref} from "vue";

/**
 * # Validation Function
 */
export type ValidationFunction = (value: any) => true | string;

/**
 * # Form Field
 */
export class FormField {

    public readonly messages: Ref<string[]>;

    constructor(
        public name: string,
        public modelValue: Ref<any>,
        public validators: ValidationFunction[] = []
    ) {
        this.messages = ref([]);
    }

    get value() {
        return this.modelValue.value;
    }

    set value(value) {
        this.modelValue.value = value;
    }

    /**
     * ## Add Message
     *
     * Add one or more validation messages to the field.
     *
     * @param message
     */
    public addMessage(...message: string[]) {
        this.messages.value.push(...message);
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

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.messages.value = [];
    }

    public async validate() {
        this.resetValidation();
        for (const validationFn of this.validators) {
            const result = await validationFn(this.value);
            if (result !== true) {
                this.addMessage(result);
            }
        }
        return this.messages.value;
    }
}