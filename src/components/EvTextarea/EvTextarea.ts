import {makeInputAppearanceProps, propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {makeFormFieldProps} from "@/composables/validation.ts";

export const makeEvTextareaProps = propsFactory({

    autofocus: Boolean,
    autoselect: Boolean,
    autogrow: {
        type: Boolean,
        default: true
    },
    autosubmit: Function,
    clearable: Boolean,
    label: String,
    loading: Boolean,
    placeholder: String,

    ...makeFormFieldProps(),
    ...makeInputAppearanceProps(),
    ...makeComponentProps()
}, 'EvTextarea');