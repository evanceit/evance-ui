import { omit, propsFactory } from "@/util";
import { makeEvDatePickerProps } from "@/components/EvDatePicker";
import { makeEvTextfieldProps } from "@/components/EvTextfield";
import { Calendar } from "@/icons";

export const makeEvDateFieldProps = propsFactory(
    {
        ...omit(
            makeEvTextfieldProps({
                iconStart: Calendar,
            }),
            ["type"],
        ),
        ...makeEvDatePickerProps(),
    },
    "EvDateField",
);
