import {omit, propsFactory} from "@/util";
import {makeEvDatePickerProps, makeEvTextfieldProps} from "@/components";
import {Calendar} from "@/icons";

export const makeEvDateFieldProps = propsFactory({
    ...omit(makeEvTextfieldProps({
        iconStart: Calendar
    }), [
        'type'
    ]),
    ...makeEvDatePickerProps()
}, 'EvDateField');