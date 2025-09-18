import { propsFactory } from "@/util";


export const makeEvTimePickerHoursProps = propsFactory(
    {
        period: String,
        modelValue: Date,
    },
    "EvTimePickerHours",
);

export interface Hour {
    value: string;
    text: string;
    isDisabled: boolean;
    isSelected: boolean;
}