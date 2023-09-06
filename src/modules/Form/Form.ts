import {FormField, Validator} from "@/modules/Form/FormField.ts";
import {Ref, ref, shallowRef, watch} from "vue";
import {consoleWarn} from "@/util";
import {FormProps} from "@/composables/form.ts";
import {ValidationError} from "@/composables/validation.ts";

/**
 * # Form
 */
export class Form {

    public readonly errors: Ref<ValidationError[]>;
    public readonly fields: Ref<FormField[]>;
    public readonly isDisabled: Ref<boolean>;
    public readonly isReadonly: Ref<boolean>;
    public readonly isValid: Ref<boolean | null>;
    public readonly isValidating: Ref<boolean>;
    public readonly validateOn: Ref<FormProps['validateOn']>;

    constructor(
        isValid: Ref<boolean | null> | undefined,
        isDisabled: Ref<boolean> | undefined,
        isReadonly: Ref<boolean> | undefined,
        validateOn: Ref<FormProps['validateOn']> | undefined
    ) {
        this.errors = ref<ValidationError[]>([]);
        this.fields = ref<FormField[]>([]);
        this.isDisabled = isDisabled ?? shallowRef(false);
        this.isReadonly = isReadonly ?? shallowRef(false);
        this.isValid = isValid ?? shallowRef(null);
        this.isValidating = shallowRef(false);
        this.validateOn = validateOn ?? shallowRef('input');
        this.watchFields();
    }

    /**
     * ## Add Field
     * @param field
     */
    public addField(field: FormField) {
        if (this.hasField(field.name)) {
            consoleWarn(`Duplicate form field with name "${field.name}"`);
        }
        this.fields.value.push(field);
    }

    /**
     * ## Create Field
     *
     * Creates and returns a new FormField, which is automatically added to the Form.
     *
     * @param name
     * @param modelValue
     * @param validators
     */
    public createField(name: string, modelValue: Ref<any>, validators: Validator[] = []): FormField {
        const field = new FormField(name, modelValue, validators);
        this.addField(field);
        return field;
    }

    /**
     * ## Get Field
     * @param name
     */
    public getField(name: string): FormField | undefined {
        return this.fields.value.find((field) => {
            return field.name === name;
        });
    }

    /**
     * ## Has Field
     *
     * Returns `true` if the field `name` already exists in the form.
     *
     * @param name
     */
    public hasField(name: string): boolean {
        return this.fields.value.some(field => field.name === name);
    }

    /**
     * ## Remove Field
     * @param name
     */
    public removeField(name: string) {
        this.fields.value  = this.fields.value.filter((field) => {
            return field.name !== name;
        });
    }

    /**
     * ## Reset
     */
    public reset() {
        this.fields.value.forEach(field => field.reset());
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.fields.value.forEach(field => field.resetValidation());
    }

    /**
     * ## Update Field
     *
     * @param name
     * @param isValid
     * @param errorMessages
     */
    public updateField(name: string, isValid: boolean, errorMessages: string[] = []) {
        this.getField(name)?.update(isValid, errorMessages);
    }

    /**
     * ## Validate
     */
    public async validate() {
        let valid = true;
        this.errors.value = [];
        this.isValidating.value = true;

        const results = [];
        for (const field of this.fields.value) {
            const fieldErrors = await field.validate();
            for (const fieldError of fieldErrors) {
                valid = false;
                results.push({
                    name: field.name,
                    message: fieldError
                });
            }
        }

        this.errors.value = results;
        this.isValidating.value = false;
        return {
            valid,
            errors: this.errors.value
        };
    }

    /**
     * ## Watch fields
     *
     * @private
     */
    private watchFields() {
        watch(this.fields, () => {
            let valid = 0;
            let invalid = 0;
            const results = [];
            for (const field of this.fields.value) {
                if (field.isValid === false) {
                    ++invalid;
                    const fieldErrors = field.errorMessages.value;
                    for (const fieldError of fieldErrors) {
                        results.push({
                            name: field.name,
                            message: fieldError
                        });
                    }
                } else if (field.isValid === true) {
                    ++valid;
                }
            }
            this.errors.value = results;
            this.isValid.value = (invalid > 0) ? false : (
                (valid === this.fields.value.length) ? true : null
            );
        }, { deep: true });
    }
}