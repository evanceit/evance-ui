import {omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield";

export const makeEvNumberFieldProps = propsFactory({
    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');