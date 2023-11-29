import {propsFactory} from "@/util";
import {makeEvDatePickerProps, makeEvTextfieldProps} from "@/components";
import {Calendar} from "@/icons";

export const makeEvDateFieldProps = propsFactory({
    ...makeEvTextfieldProps({
        readonly: true,
        iconStart: Calendar
    }),
    ...makeEvDatePickerProps()
}, 'EvDateField');