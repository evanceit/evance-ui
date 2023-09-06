import {Ref, ref, shallowRef} from "vue";
import {Validator} from "@/composables/validation.ts";
import {consoleWarn, isFunction, isString} from "@/util";


/**
 * # Form Field
 */
export class FormField {

    public readonly errorMessages: Ref<string[]>;
    public readonly valid: Ref<boolean | null>;
    public readonly validating: Ref<boolean>;

    constructor(
        public name: string,
        public modelValue: Ref<any>,
        public validators: Validator[] = []
    ) {
        this.errorMessages = ref([]);
        this.valid = shallowRef(null);
        this.validating = shallowRef(false);
    }

    get isValid() {
        return this.valid.value;
    }

    get isValidating() {
        return this.validating.value;
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
        this.errorMessages.value.push(...message);
    }

    /**
     * ## Add Validator
     *
     * Add one or more validation functions to the field.
     *
     * @param validator
     */
    public addValidator(...validator: Validator[]) {
        this.validators.push(...validator);
    }

    /**
     * ## Reset
     */
    public reset() {
        this.value = null;
        this.resetValidation();
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.valid.value = null;
        this.errorMessages.value = [];
    }

    /**
     * ## Update
     * @param isValid
     * @param errorMessages
     */
    public update(isValid: boolean, errorMessages: string[] = []) {
        this.valid.value = isValid;
        this.errorMessages.value = errorMessages;
    }

    /**
     * ## Validate
     */
    public async validate() {
        this.resetValidation();
        this.validating.value = true;
        for (const validator of this.validators) {
            const validatorFn = isFunction(validator) ? validator : () => validator;
            const result = await validatorFn(this.value);
            if (result === true) {
                continue;
            }
            if (!isString(result)) {
                consoleWarn(`${result} is not a valid value. Validator functions must return boolean true or a string.`);
            }
            if (result !== true) {
                this.addMessage(result);
            }
        }
        this.valid.value = (this.errorMessages.value.length === 0);
        this.validating.value = false;
        return this.errorMessages.value;
    }
}