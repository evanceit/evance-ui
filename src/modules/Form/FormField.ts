import {computed, nextTick, onBeforeMount, onMounted, Ref, ref, shallowRef, watch} from "vue";
import {FormFieldProps, Validator} from "@/composables/validation.ts";
import {consoleWarn, getNextId, isFunction, isString, wrapInArray} from "@/util";
import {Form} from "@/modules/Form/Form.ts";
import {useToggleScope} from "@/composables/toggleScope.ts";


/**
 * # Form Field
 */
export class FormField {

    public readonly uid = getNextId();

    private readonly messages: Ref<string[]> = ref([]);

    public readonly pristine = shallowRef(true);

    public readonly validating = shallowRef(false);

    private readonly validationModel: Ref<any>;

    constructor(
        public readonly form: Form | null,
        public readonly model: Ref<any>,
        private props: FormFieldProps
    ) {

        // We use a computed() Ref here for a valid watch()
        this.validationModel = computed(() => {
            return (this.props.validationValue === undefined) ? this.model.value : this.props.validationValue;
        });

        onBeforeMount(() => {
            this.form?.addField(this);
        });

        onMounted(async () => {
            if (!this.validateOn.lazy) {
                await this.validate();
            }
        });

        useToggleScope(() => this.validateOn.input, () => {
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

        useToggleScope(() => this.validateOn.blur, () => {
            watch(() => props.focused, (value) => {
                if (!value) {
                    this.validate();
                }
            });
        });
    }

    get classes() {
        return {
            'is-error': this.isValid === false,
            'is-dirty': this.isDirty,
            'is-disabled': this.isDisabled,
            'is-readonly': this.isReadonly
        }
    }

    get errorMessages() {
        return this.messages.value;
    }

    get id() {
        return this.props.id || `input-${this.uid}`;
    }

    get isDirty() {
        return !!(
            wrapInArray(this.model.value === '' ? null : this.model.value).length ||
            wrapInArray(this.validationModel.value === '' ? null : this.validationModel.value).length
        );
    }

    get isDisabled() {
        return !!(this.props.disabled ?? this.form?.isDisabled.value);
    }

    get isReadonly() {
        return !!(this.props.readonly ?? this.form?.isReadonly.value);
    }

    get isPristine() {
        return this.pristine.value;
    }

    get isValid() {
        if (this.props.error) {
            return false;
        }
        if (!this.props.validators.length) {
            return true;
        }
        if (this.isPristine) {
            return this.errorMessages.length || this.validateOn.lazy ? null : true;
        } else {
            return !this.errorMessages.length;
        }
    }

    get isValidating() {
        return this.validating.value;
    }

    get name() {
        return this.props.name ?? this.id;
    }

    get validateOn() {
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
    };

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
        this.messages.value.push(...message);
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
     * ## Expose
     */
    public expose() {
        return {
            reset: this.reset.bind(this),
            resetValidation: this.resetValidation.bind(this),
            validate: this.validate.bind(this)
        };
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
        this.pristine.value = true;
        if (!this.validateOn.lazy) {
            this.validate(true);
        } else {
            this.messages.value = [];
        }
    }

    /**
     * ## Validate
     */
    public async validate(silent = false) {
        const results = [];
        this.validating.value = true;
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
        this.messages.value = results;
        this.validating.value = false;
        this.pristine.value = silent;
        return this.messages.value;
    }
}