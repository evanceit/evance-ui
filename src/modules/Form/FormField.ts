import {computed, ComputedRef, nextTick, onBeforeMount, onMounted, Ref, ref, shallowRef, watch} from "vue";
import {FormFieldProps, Validator} from "@/composables/validation.ts";
import {consoleWarn, isFunction, isString, wrapInArray} from "@/util";
import {Form} from "@/modules/Form/Form.ts";
import {useToggleScope} from "@/composables/toggleScope.ts";


/**
 * # Form Field
 */
export class FormField {

    public classes = computed(() => {
        return {
            'is-error': this.isValid.value === false,
            'is-dirty': this.isDirty.value,
            'is-disabled': this.isDisabled.value,
            'is-readonly': this.isReadonly.value
        }
    });

    public errorMessages: Ref<string[]> = ref([]);

    public isDirty = computed(() => !!(
        wrapInArray(this.model.value === '' ? null : this.model.value).length ||
        wrapInArray(this.validationModel.value === '' ? null : this.validationModel.value).length
    ));

    public isDisabled = computed(() => {
        return !!(this.props.disabled ?? this.form?.isDisabled.value);
    });

    public isPristine = shallowRef(true);

    public isReadonly = computed(() => {
        return !!(this.props.readonly ?? this.form?.isReadonly.value);
    });

    public isValid = computed(() => {
        if (this.props.error) {
            return false;
        }
        if (!this.props.validators.length) {
            return true;
        }
        if (this.isPristine.value) {
            return this.errorMessages.value.length || this.validateOn.value.lazy ? null : true;
        } else {
            return !this.errorMessages.value.length;
        }
    });

    public isValidating = shallowRef(false);

    private validateOn = computed(() => {
        let value = (this.props.validateOn ?? this.form?.validateOn.value) || 'input';
        if (value === 'lazy') {
            value = 'input lazy';
        }
        const set = new Set(value?.split(' ') ?? []);
        return {
            blur: set.has('blur') || set.has('input'),
            input: set.has('input'),
            submit: set.has('submit'),
            lazy: set.has('lazy')
        };
    });

    private validationModel = computed(() => {
        return (this.props.validationValue === undefined) ? this.model.value : this.props.validationValue;
    });

    constructor(
        public form: Form | null,
        public name: string,
        public model: Ref<any>,
        private props: FormFieldProps
    ) {

        onBeforeMount(() => {
            form?.addField(this);
        });

        onMounted(async () => {
            if (!this.validateOn.value.lazy) {
                await this.validate();
            }
        });

        useToggleScope(() => this.validateOn.value.input, () => {
            watch(this.validationModel, () => {
                if (this.validationModel.value != null) {
                    this.validate();
                } else if (this.props.focused) {
                    const unwatch = watch(() => this.props.focused, (value) => {
                        if (!value) {
                            this.validate();
                        }
                        unwatch();
                    });
                }
            });
        });

        useToggleScope(() => this.validateOn.value.blur, () => {
            watch(() => props.focused, (value) => {
                if (!value) {
                    this.validate();
                }
            });
        });
    }

    get value() {
        return this.model.value;
    }

    set value(value) {
        this.model.value = value;
    }

    /**
     * ## Add Error Message
     *
     * Add one or more validation messages to the field.
     *
     * @param message
     */
    public addErrorMessage(...message: string[]) {
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
        this.props.validators.push(...validator);
    }

    /**
     * ## Reset
     */
    public reset() {
        this.model.value = null;
        nextTick(() => {
            this.resetValidation();
        });
    }

    /**
     * ## Reset Validation
     */
    public resetValidation() {
        this.isPristine.value = true;
        if (!this.validateOn.value.lazy) {
            this.validate(true);
        } else {
            this.errorMessages.value = [];
        }
    }

    /**
     * ## Validate
     */
    public async validate(silent = false) {
        const results = [];
        this.isValidating.value = true;
        for (const validator of this.props.validators) {
            const validatorFn = isFunction(validator) ? validator : () => validator;
            const result = await validatorFn(this.validationModel.value);
            if (result === true) {
                continue;
            }
            if (!isString(result)) {
                consoleWarn(`${result} is not a valid value. Validator functions must return boolean true or a string.`);
                continue;
            }
            results.push(result);
        }
        this.errorMessages.value = results;
        this.isValidating.value = false;
        this.isPristine.value = silent;
        return this.errorMessages.value;
    }
}