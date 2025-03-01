import { FormField } from "@/modules/Form/FormField";
import { Ref, ref, shallowRef, toRaw } from "vue";
import { consoleWarn } from "@/util";
import { FormProps } from "@/composables/form";
import { ValidationError } from "@/composables/validation";

/**
 * # Form
 */
export class Form {
    public readonly errors: Ref<ValidationError[]> = ref([]);
    private fields: FormField[] = [];
    public readonly isDisabled: Ref<boolean>;
    public readonly isReadonly: Ref<boolean>;
    public readonly isValid: Ref<boolean | null>;
    public readonly isValidating = shallowRef(false);
    public readonly validateOn: Ref<FormProps["validateOn"]>;

    constructor(
        isValid: Ref<boolean | null> | undefined,
        isDisabled: Ref<boolean> | undefined,
        isReadonly: Ref<boolean> | undefined,
        validateOn: Ref<FormProps["validateOn"]> | undefined,
    ) {
        this.isDisabled = isDisabled ?? shallowRef(false);
        this.isReadonly = isReadonly ?? shallowRef(false);
        this.isValid = isValid ?? shallowRef(null);
        this.validateOn = validateOn ?? shallowRef("input");
    }

    /**
     * ## Add Field
     * @param field
     */
    public addField(field: FormField) {
        if (this.hasField(field.id)) {
            consoleWarn(`Duplicate form field with name "${field.id}"`);
        }
        this.fields.push(field);
    }

    /**
     * ## Expose
     */
    public expose() {
        return {
            reset: this.reset.bind(this),
            resetValidation: this.resetValidation.bind(this),
            validate: this.validate.bind(this),
        };
    }

    /**
     * ## Get Field
     * @param id
     */
    public getField(id: string): FormField | undefined {
        return this.fields.find((field) => {
            return field.id === id;
        });
    }

    /**
     * ## Has Field
     *
     * Returns `true` if the field `name` already exists in the form.
     *
     * @param id
     */
    public hasField(id: string): boolean {
        return this.fields.some((field) => field.id === id);
    }

    /**
     * ## Remove Field
     * @param id
     */
    public removeField(id: string) {
        this.fields = this.fields.filter((field) => {
            return field.id !== id;
        });
    }

    /**
     * ## Reset
     */
    public reset() {
        this.fields.forEach((field) => field.reset());
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.fields.forEach((field) => field.resetValidation());
    }

    /**
     * ## Validate
     */
    public async validate() {
        let valid = true;
        this.errors.value = [];
        this.isValidating.value = true;

        const results = [];
        for (const field of this.fields) {
            const fieldErrors = await field.validate();
            for (const fieldError of fieldErrors) {
                valid = false;
                results.push({
                    name: field.name,
                    message: fieldError,
                });
            }
        }

        this.errors.value = results;
        this.isValidating.value = false;
        return {
            valid,
            errors: toRaw(this.errors.value),
        };
    }
}
