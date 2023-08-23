import {FormField, ValidationFunction} from "@/modules/Form/FormField.ts";
import {Ref, ref, ShallowRef, shallowRef} from "vue";
import {consoleWarn} from "@/util";

/**
 * # Form
 */
export class Form {

    public readonly errors: Ref<ValidationError[]>;
    public readonly fields: Ref<FormField[]>;
    public readonly isValidating: ShallowRef<boolean>;

    constructor() {
        this.errors = ref<ValidationError[]>([]);
        this.fields = ref<FormField[]>([]);
        this.isValidating = shallowRef(false);
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
     * ## Has Field
     * Returns `true` if the field `name` already exists in the form.
     * @param name
     */
    public hasField(name: string): boolean {
        return this.fields.value.some(field => field.name === name);
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.fields.value.forEach(field => field.resetValidation());
    }

    public async validate() {
        this.errors.value = [];
        this.isValidating.value = true;

        const results = [];
        for (const field of this.fields.value) {
            const fieldErrors = await field.validate();
            for (const fieldError of fieldErrors) {
                results.push({
                    name: field.name,
                    message: fieldError
                });
            }
        }

        this.errors.value = results;
        this.isValidating.value = false;
    }
}


/**
 * # Validation Error
 *
 * Represents a single error message with a name identifier.
 *
 */
export interface ValidationError {
    name: number | string;
    message: string;
}
