import {makeInputAppearanceProps, makeInputSizeProps, makeTextAlignProps, propsFactory} from "@/util";
import {IconValue} from "@/composables/icons.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";
import {makeComponentProps} from "@/composables/component.ts";
import {PropType} from "vue";


/**
 * # Make EvTextfield Props
 */
export const makeEvTextfieldProps = propsFactory({
    autofocus: Boolean,
    autoselect: Boolean,
    clearable: Boolean,
    iconStart: IconValue,
    iconEnd: IconValue,
    label: String,
    loading: Boolean,
    placeholder: String,
    prefix: String,
    rounded: Boolean,
    suffix: String,
    type: {
        type: String,
        default: 'text'
    },
    monospace: Boolean,

    ...makeTextAlignProps(),
    ...makeFormFieldProps(),
    ...makeInputAppearanceProps(),
    ...makeInputSizeProps(),
    ...makeComponentProps()
}, 'EvTextfield');