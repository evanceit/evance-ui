import {propsFactory} from "@/util";
import {makeEvDatePickerProps, makeEvTextfieldProps} from "@/components";

export const makeEvDateFieldProps = propsFactory({
    ...makeEvTextfieldProps(),
    ...makeEvDatePickerProps()
}, 'EvDateField');