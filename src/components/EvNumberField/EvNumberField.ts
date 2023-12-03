import {omit, propsFactory} from "@/util";
import {makeEvTextfieldProps} from "@/components/EvTextfield/EvTextfield.ts";

export const makeEvNumberFieldProps = propsFactory({
    decimalPlacesMin: Number,
    decimalPlacesMax: Number,
    min: {
        type: Number,
        default: null
    },
    max: {
        type: Number,
        default: null
    },
    step: {
        type: Number,
        default: 1
    },

    ...omit(makeEvTextfieldProps(), [
        'type'
    ]),
}, 'EvNumberField');