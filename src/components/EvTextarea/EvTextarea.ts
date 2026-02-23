import { makeInputAppearanceProps, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeFormFieldProps } from "@/composables/validation";
import { makeLabelProps } from "@/components/EvLabel";

export const makeEvTextareaProps = propsFactory(
    {
        autofocus: Boolean,
        autoselect: Boolean,
        autogrow: {
            type: Boolean,
            default: true,
        },
        autosubmit: Function,
        clearable: Boolean,
        loading: Boolean,
        placeholder: String,
        maxlength: Number,

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeInputAppearanceProps(),
        ...makeComponentProps(),
    },
    "EvTextarea",
);
