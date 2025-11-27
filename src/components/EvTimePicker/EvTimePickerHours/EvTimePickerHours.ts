import { propsFactory } from "@/util";
import { PropType } from "vue";


export const makeEvTimePickerHoursProps = propsFactory(
    {
        period: String,
        modelValue: Date,
        hourFormat: Number as PropType<12 | 24>,
    },
    "EvTimePickerHours",
);

export interface Hour {
    value: string;
    text: string;
    isDisabled: boolean;
    isSelected: boolean;
}
