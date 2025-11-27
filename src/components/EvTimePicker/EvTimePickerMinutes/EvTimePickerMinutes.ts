import { propsFactory } from "@/util";
import { PropType } from "vue";

export const makeEvTimePickerMinutesProps = propsFactory(
    {
        modelValue: [String, Date],
        hourFormat: Number as PropType<12 | 24>,
    },
    "EvTimePickerMinutes",
);

export interface Minutes {
    value: string;
    text: string;
    isDisabled: boolean;
    isSelected: boolean;
}