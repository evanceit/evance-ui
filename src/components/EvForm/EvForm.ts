import { propsFactory } from "@/util";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import { FormProps, makeFormProps } from "@/composables/form";

export interface EvFormProps extends FormProps, ComponentProps {}

export const makeEvFormProps = propsFactory(
    {
        ...makeComponentProps(),
        ...makeFormProps(),
    },
    "EvForm",
);
