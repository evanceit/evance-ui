import {omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield/EvTextfield.ts";

export const makeEvNumberFieldProps = propsFactory({
    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');