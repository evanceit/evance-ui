import { propsFactory } from "@/util";

export const makeEvTimePickerMinutesProps = propsFactory(
    {
        modelValue: [String, Date],
    },
    "EvTimePickerMinutes",
)

export interface Minutes {
    value: string;
    text: string;
    isDisabled: boolean;
    isSelected: boolean;
}