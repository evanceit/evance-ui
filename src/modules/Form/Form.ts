import { FormField } from "@/modules/Form/FormField";
import {computed, Ref, ref, shallowRef, toRaw, toRef} from "vue";
import { consoleWarn } from "@/util";
import { FormProps } from "@/composables/form";
import { ValidationError } from "@/composables/validation";
import {useModelProxy} from "@/composables/modelProxy.ts";

/**
 * # Form
 */
export class Form {
    public readonly errors: Ref<ValidationError[]> = ref([]);
    private fields: FormField[] = [];
    public readonly data: Ref<object>;
    public readonly isDisabled: Ref<boolean>;
    public readonly isReadonly: Ref<boolean>;
    public readonly isValid: Ref<boolean | null>;
    public readonly isValidating = shallowRef(false);
    public readonly validateOn: Ref<FormProps["validateOn"]>;

    constructor(
        private props: FormProps,
    ) {
        this.data = useModelProxy(this.props, "data");
        this.isValid = useModelProxy(this.props, "modelValue");
        this.isDisabled = computed(() => this.props.disabled);
        this.isReadonly = computed(() => this.props.readonly);
        this.validateOn = toRef(props, "validateOn");
    }

    public addErrors(errors: ValidationError[]) {
        errors.forEach(({ name, message }) => {
            this.getField(name)?.addError(message);
        });
        this.isValid.value = false;
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
        this.isValid.value = null;
        this.errors.value = [];
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.fields.forEach((field) => field.resetValidation());
        this.isValid.value = null;
        this.errors.value = [];
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
        this.isValid.value = valid;
        return {
            valid,
            errors: [...toRaw(this.errors.value)],
            addErrors: (errors: ValidationError[]) => {
                this.addErrors(errors)
            },
        };
    }
}
