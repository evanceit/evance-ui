import { EventProp, propsFactory } from "@/util";
import { PropType } from "vue";

export interface EvTimePickerProps {
    modelValue: string | Date;
    hourFormat: 12 | 24;
    period: "am" | "pm";
    "onUpdate:modelValue": EventProp<[unknown]> | undefined;
}

export const makeEvTimePickerProps = propsFactory(
    {
        modelValue: [String, Date],
        hourFormat: {
            type: Number as PropType<EvTimePickerProps["hourFormat"]>,
            default: undefined,
            validator: (val: number) => val === 12 || val === 24,
        },
    },
    "EvTimePicker",
);
