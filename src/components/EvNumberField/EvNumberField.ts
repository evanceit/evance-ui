import {omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield/EvTextfield.ts";

export const makeEvNumberFieldProps = propsFactory({
    min: Number,
    max: Number,
    increment: {
        type: Number,
        default: 1
    },

    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');