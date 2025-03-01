import { computed, inject, InjectionKey, PropType, provide, toRef } from "vue";
import { ValidationError, FormFieldProps } from "@/composables/validation";
import { propsFactory } from "@/util";
import { Form } from "@/modules/Form/Form";
import { useModelProxy } from "@/composables/modelProxy";

/**
 * # Form Key
 * Used for provide/inject functions.
 */
export const FormKey: InjectionKey<any> = Symbol.for("ev:form");

/**
 * # Submit Event Promise
 */
export interface SubmitEventPromise
    extends SubmitEvent,
        Promise<FormValidationResult> {}

/**
 * # Form Props
 */
export interface FormProps {
    disabled?: boolean;
    readonly?: boolean;
    modelValue?: boolean | null;
    "onUpdate:modelValue"?: ((val: boolean | null) => void) | undefined;
    validateOn?: FormFieldProps["validateOn"];
}

/**
 * # Form Validation Result
 */
export interface FormValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

/**
 * # Make Form Props
 */
export const makeFormProps = propsFactory(
    {
        disabled: Boolean,
        readonly: Boolean,
        modelValue: {
            type: Boolean as PropType<boolean | null>,
            default: null,
        },
        validateOn: {
            type: String as PropType<FormProps["validateOn"]>,
            default: "input",
        },
    },
    "form",
);

/**
 * # Create Form
 * @param props
 */
export function createForm(props: FormProps) {
    const isValid = useModelProxy(props, "modelValue");
    const isDisabled = computed(() => props.disabled);
    const isReadonly = computed(() => props.readonly);
    const validateOn = toRef(props, "validateOn");

    const form = new Form(isValid, isDisabled, isReadonly, validateOn);

    provide(FormKey, form);

    return form;
}

/**
 * # Use Form
 */
export function useForm() {
    return inject(FormKey, null);
}
