import {makeInputAppearanceProps, makeInputSizeProps, propsFactory} from "@/util";
import {IconValue} from "@/composables/icons.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";


export const makeEvTextfieldProps = propsFactory({

    // Other props
    autofocus: Boolean,
    autoselect: Boolean,
    clearable: Boolean,
    iconStart: IconValue,
    iconEnd: IconValue,
    id: String,
    loading: Boolean,
    placeholder: String,
    prefix: String,
    rounded: Boolean,
    suffix: String,
    type: {
        type: String,
        default: 'text'
    },

    ...makeInputAppearanceProps(),
    ...makeInputSizeProps(),
    ...makeFormFieldProps()
}, 'EvTextfield');