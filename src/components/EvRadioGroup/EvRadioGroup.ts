import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { InjectionKey } from "vue";
import { FormField } from "@/modules/Form/FormField.ts";

export interface EvRadioGroupContext extends FormField {}

export const EvRadioGroupSymbol: InjectionKey<EvRadioGroupContext> =
    Symbol.for("ev:radio-group");

export const makeEvRadioGroupProps = propsFactory(
    {
        label: String,
        inline: Boolean,

        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadioGroup",
);
