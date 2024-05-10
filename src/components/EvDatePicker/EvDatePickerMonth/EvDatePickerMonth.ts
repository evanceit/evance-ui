import { propsFactory } from "@/util";
import { PropType } from "vue";

export type SelectionModeProp = "single" | "multiple" | "range";

// type ModelValueProp = Array

export const makeEvDatePickerMonthProps = propsFactory(
    {
        allowedDates: [Array, Function],
        max: null as any as PropType<unknown>,
        min: null as any as PropType<unknown>,
        modelValue: [Array, String, Date],
        month: [Number, String],
        selectionMode: {
            type: String as PropType<SelectionModeProp>,
            default: "single",
        },
        showAdjacentMonths: {
            type: Boolean,
            default: true,
        },
        year: [Number, String],
    },
    "EvDatePickerMonth",
);

/**
 * # Day
 * Represents data used for rendering days in the month.
 */
export interface Day {
    date: Date;
    isoDate: string;
    formatted: string;
    year: number;
    month: number;
    isDisabled: boolean;
    isWeekStart: boolean;
    isWeekEnd: boolean;
    isSelected: boolean;
    isToday: boolean;
    isAdjacent: boolean;
    isInRange: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isHidden: boolean;
    isHovered: boolean;
    localized: string;
}
