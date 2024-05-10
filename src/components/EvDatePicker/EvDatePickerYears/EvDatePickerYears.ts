import { propsFactory } from "@/util";
import { PropType } from "vue";

export const makeEvDatePickerYearsProps = propsFactory(
    {
        min: null as any as PropType<unknown>,
        max: null as any as PropType<unknown>,
        modelValue: Number,
    },
    "EvDatePickerYears",
);
