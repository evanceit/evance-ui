import { propsFactory } from "@/util";


export const makeEvTimePickerProps = propsFactory(
    {
        modelValue: [String, Date],
    },
    "EvTimePicker",
)