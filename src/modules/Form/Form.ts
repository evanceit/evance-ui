import { FormField } from "@/modules/Form/FormField";
import { Ref, ref, shallowRef, toRaw, toRef } from "vue";
import { consoleWarn } from "@/util";
import { FormProps } from "@/composables/form";
import { ValidationError } from "@/composables/validation";
import { useModelProxy } from "@/composables/modelProxy.ts";

/**
 * # Form
 */
export class Form {
    private fields: FormField[] = [];
    private valid: Ref<boolean | null>;
    private validating = shallowRef(false);

    public readonly errors: Ref<ValidationError[]> = ref([]);
    public readonly data: Ref<object>;
    public readonly validateOn: Ref<FormProps["validateOn"]>;

    constructor(private props: FormProps) {
        this.data = useModelProxy(this.props, "data");
        this.valid = useModelProxy(this.props, "modelValue");
        this.validateOn = toRef(props, "validateOn");
    }

    get isDisabled(): boolean {
        return this.props.disabled;
    }

    get isReadonly(): boolean {
        return this.props.readonly;
    }

    get isValid(): boolean | null {
        return this.valid.value;
    }

    get isValidating(): boolean {
        return this.validating.value;
    }

    public addErrors(errors: ValidationError[]) {
        errors.forEach(({ name, message }) => {
            this.getField(name as string)?.addError(message);
        });
        this.valid.value = false;
        this.errors.value.push(...errors);
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
            addErrors: this.addErrors.bind(this),
            getField: this.getField.bind(this),
            reset: this.reset.bind(this),
            resetValidation: this.resetValidation.bind(this),
            validate: this.validate.bind(this),
        };
    }

    /**
     * ## Get Field
     * @param name
     */
    public getField(name: string): FormField | undefined {
        return this.fields.find((field) => {
            return field.name === name;
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
        this.valid.value = null;
        this.errors.value = [];
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.fields.forEach((field) => field.resetValidation());
        this.valid.value = null;
        this.errors.value = [];
    }

    /**
     * ## Validate
     */
    public async validate() {
        let valid = true;
        this.errors.value = [];
        this.validating.value = true;

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
        this.validating.value = false;
        this.valid.value = valid;
        return {
            valid,
            errors: [...toRaw(this.errors.value)],
            addErrors: (errors: ValidationError[]) => {
                this.addErrors(errors);
            },
        };
    }
}
