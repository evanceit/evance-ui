import {propsFactory} from "@/util";
import {PropType} from "vue";

export type SelectionModeProp = 'single' | 'multiple' | 'range';

// type ModelValueProp = Array

export const makeEvDatePickerMonthProps = propsFactory({
    allowedDates: [Array, Function],
    max: null as any as PropType<unknown>,
    min: null as any as PropType<unknown>,
    modelValue: [Array, String, Date],
    month: [Number, String],
    selectionMode: {
        type: String as PropType<SelectionModeProp>,
        default: 'single'
    },
    showAdjacentMonths: {
        type: Boolean,
        default: true
    },
    year: [Number, String],
}, 'EvDatePickerMonth');