import { omit, propsFactory } from "@/util";
import { makeEvDatePickerMonthProps } from "@/components/EvDatePicker/EvDatePickerMonth";
import { makeEvDatePickerYearsProps } from "@/components/EvDatePicker/EvDatePickerYears";
import { PropType } from "vue";

export const makeEvDatePickerProps = propsFactory(
    {
        viewMode: {
            type: String as PropType<"month" | "months" | "years">,
            default: "month",
        },

        ...makeEvDatePickerMonthProps(),
        ...omit(makeEvDatePickerYearsProps as any, ["modelValue"]),
    },
    "EvDatePicker",
);
