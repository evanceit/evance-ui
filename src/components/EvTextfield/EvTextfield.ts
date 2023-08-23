import {makeInputAppearanceProps, makeInputSizeProps, propsFactory} from "@/util";
import {IconValue} from "@/composables/icons.ts";
import {PropType} from "vue";


export const makeEvTextfieldProps = propsFactory({

    // Input props
    disabled: {
        type: Boolean as PropType<boolean | null>,
        default: null,
    },
    name: String,
    readonly: {
        type: Boolean as PropType<boolean | null>,
        default: null,
    },
    modelValue: null,

    // Other props
    autofocus: Boolean,
    autoselect: Boolean,
    clearable: Boolean,
    focused: Boolean,
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
    ...makeInputSizeProps()
}, 'EvTextfield');