import { propsFactory } from "@/util";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { makeComponentProps } from "@/composables/component.ts";
import { makeLabelProps } from "@/components/EvLabel";

export const makeEvRadioProps = propsFactory(
    {
        clearable: Boolean,
        value: null,
        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadio",
);
