import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { InjectionKey } from "vue";
import { FormField } from "@/modules/Form/FormField.ts";
import { makeLabelProps } from "@/components/EvLabel";

export interface EvRadioGroupContext extends FormField {}

export const EvRadioGroupSymbol: InjectionKey<EvRadioGroupContext> =
    Symbol.for("ev:radio-group");

export const makeEvRadioGroupProps = propsFactory(
    {
        inline: Boolean,

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadioGroup",
);
