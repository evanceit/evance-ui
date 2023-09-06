import {getNextId, propsFactory} from "@/util";
import {computed, PropType} from "vue";
import {makeFocusProps} from "@/composables/focus.ts";
import {useForm} from "@/composables/form.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";


/**
 * # Validation Error
 *
 * Represents a single error message with a name identifier.
 */
export interface ValidationError {
    name: number | string;
    message: string;
}

/**
 * # Validation Result
 */
export type ValidationResult = string | boolean;

/**
 * # Validator
 */
export type Validator = ValidationResult
    | PromiseLike<ValidationResult>
    | ((value: any) => ValidationResult)
    | ((value: any) => PromiseLike<ValidationResult>);

/**
 * # Validate On Event
 */
export type ValidateOnEvent = 'blur' | 'input' | 'submit';

/**
 * # Validation Props
 */
export interface ValidationProps {
    disabled: boolean | null;
    error: boolean;
    focused: boolean;
    name: string | undefined;
    readonly: boolean | null;
    validators: readonly Validator[];
    modelValue: any;
    validateOn?: ValidateOnEvent | `${ValidateOnEvent} lazy` | `lazy ${ValidateOnEvent}` | 'lazy';
    validationValue: any;
}

/**
 * # Make Validation Props
 */
export const makeValidationProps = propsFactory({
    disabled: {
        type: Boolean as PropType<boolean | null>,
        default: null,
    },
    error: Boolean,
    name: String,
    readonly: {
        type: Boolean as PropType<boolean | null>,
        default: null,
    },
    validators: {
        type: Array as PropType<readonly Validator[]>,
        default: () => ([]),
    },
    modelValue: null,
    validateOn: String as PropType<ValidationProps['validateOn']>,
    validationValue: null,

    ...makeFocusProps()
}, 'validation');


/**
 * # Use Validation
 * @param props
 */
export function useValidation(
    props: ValidationProps
) {

    const uid = getNextId();
    const fieldName = computed(() => {
        return props.name ?? `input-${uid}`;
    });
    const form = useForm();
    const model = useModelProxy(props, 'modelValue');
    const validationModel = computed(() => {
        return (props.validationValue === undefined) ? model.value : props.validationValue;
    });
    const isDisabled = computed(() => {
        return !!(props.disabled ?? form?.isDisabled.value);
    });
    const isReadonly = computed(() => {
        return !!(props.readonly ?? form?.isReadonly.value);
    });
    const validateOn = computed(() => {
        let value = (props.validateOn ?? form?.validateOn.value) || 'input';
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


}