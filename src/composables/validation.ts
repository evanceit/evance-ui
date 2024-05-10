import { propsFactory } from "@/util";
import { PropType } from "vue";
import { makeFocusProps } from "@/composables/focus.ts";
import { useForm } from "@/composables/form.ts";
import { FormField } from "@/modules/Form/FormField.ts";

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
export type Validator =
    | ValidationResult
    | PromiseLike<ValidationResult>
    | ((value: any) => ValidationResult)
    | ((value: any) => PromiseLike<ValidationResult>);

/**
 * # Validate On Event
 */
export type ValidateOnEvent = "blur" | "input" | "submit";

/**
 * # Form Field Props
 */
export interface FormFieldProps {
    id?: string;
    disabled?: boolean;
    error?: boolean;
    focused?: boolean;
    name?: string;
    readonly?: boolean;
    validators: Validator[];
    modelValue?: any;
    validateOn?:
        | ValidateOnEvent
        | `${ValidateOnEvent} lazy`
        | `lazy ${ValidateOnEvent}`
        | "lazy";
    validationValue?: any;
}

/**
 * # Make Form Field Props
 */
export const makeFormFieldProps = propsFactory(
    {
        id: String,
        disabled: Boolean,
        error: Boolean,
        name: String,
        readonly: Boolean,
        validators: {
            type: Array as PropType<FormFieldProps["validators"]>,
            default: [],
        },
        modelValue: null,
        validateOn: String as PropType<FormFieldProps["validateOn"]>,
        validationValue: null,

        ...makeFocusProps(),
    },
    "validation",
);

/**
 * # Use Form Field
 * @param props
 * @param group
 */
export function useFormField(
    props: FormFieldProps,
    group: FormField | undefined = undefined,
) {
    const form = useForm();
    return new FormField(form, props, group);
}
