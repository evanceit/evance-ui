import { propsFactory } from "@/util";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvRadioProps = propsFactory(
    {
        label: String,
        clearable: Boolean,
        value: null,

        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadio",
);
