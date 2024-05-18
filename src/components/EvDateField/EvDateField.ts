import { omit, propsFactory } from "@/util";
import { makeEvDatePickerProps } from "@/components/EvDatePicker";
import { makeEvTextfieldProps } from "@/components/EvTextfield";
import { CalendarIcon } from "@/icons";

export const makeEvDateFieldProps = propsFactory(
    {
        ...omit(
            makeEvTextfieldProps({
                iconStart: CalendarIcon,
            }),
            ["type"],
        ),
        ...makeEvDatePickerProps(),
    },
    "EvDateField",
);
