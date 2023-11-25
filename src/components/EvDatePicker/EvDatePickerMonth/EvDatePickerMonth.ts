import {propsFactory} from "@/util";
import {PropType} from "vue";

export const makeEvDatePickerMonthProps = propsFactory({
    allowedDates: [Array, Function],
    max: null as any as PropType<unknown>,
    min: null as any as PropType<unknown>,
    modelValue: Array as PropType<unknown[]>,
    month: [Number, String],
    multiple: Boolean,
    showAdjacentMonths: Boolean,
    year: [Number, String],
}, 'EvDatePickerMonth');