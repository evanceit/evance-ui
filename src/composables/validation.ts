import {propsFactory} from "@/util";
import {PropType} from "vue";
import {makeFocusProps} from "@/composables/focus.ts";

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
    'onUpdate:modelValue': ((value: any) => void) | undefined;
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