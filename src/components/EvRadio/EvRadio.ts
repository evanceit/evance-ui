import { propsFactory } from "@/util";
import { makeFormFieldProps } from "@/composables/validation";
import { makeComponentProps } from "@/composables/component";
import { LabelPosition, makeLabelProps } from "@/components/EvLabel";
import { PropType } from "vue";

export const makeEvRadioProps = propsFactory(
    {
        clearable: Boolean,
        value: null,
        labelPosition: String as PropType<LabelPosition>,

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvRadio",
);
