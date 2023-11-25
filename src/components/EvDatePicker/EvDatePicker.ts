import {propsFactory} from "@/util";
import {makeEvDatePickerMonthProps} from "@/components/EvDatePicker/EvDatePickerMonth";


export const makeEvDatePickerProps = propsFactory({
    ...makeEvDatePickerMonthProps()
}, 'EvDatePicker');