import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeFormFieldProps } from "@/composables/validation";
import { InjectionKey, PropType } from "vue";
import { FormField } from "@/modules/Form/FormField";
import { LabelPosition, makeLabelProps } from "@/components/EvLabel";

export interface EvRadioGroupContext extends FormField {}

export const EvRadioGroupSymbol: InjectionKey<EvRadioGroupContext> =
    Symbol.for("ev:radio-group");

export const makeEvRadioGroupProps = propsFactory(
    {
        inline: Boolean,
        labelPosition: String as PropType<LabelPosition>,

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadioGroup",
);
