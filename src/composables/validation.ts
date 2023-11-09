import {propsFactory} from "@/util";
import {PropType} from "vue";
import {makeFocusProps} from "@/composables/focus.ts";
import {useForm} from "@/composables/form.ts";
import {FormField} from "@/modules/Form/FormField.ts";


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
 * # Form Field Props
 */
export interface FormFieldProps {
    id: string | undefined;
    disabled: boolean | null;
    error: boolean;
    focused: boolean;
    name: string | undefined;
    readonly: boolean | null;
    validators: Validator[];
    modelValue: any;
    validateOn?: ValidateOnEvent | `${ValidateOnEvent} lazy` | `lazy ${ValidateOnEvent}` | 'lazy';
    validationValue: any;
}

/**
 * # Make Form Field Props
 */
export const makeFormFieldProps = propsFactory({
    id: String,
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
    validateOn: String as PropType<FormFieldProps['validateOn']>,
    validationValue: null,

    ...makeFocusProps()
}, 'validation');


/**
 * # Use Form Field
 * @param props
 */
export function useFormField(
    props: FormFieldProps,
    group?: FormFieldProps = undefined
) {
    const form = useForm();
    return new FormField(
        form,
        props,
        group
    );
}