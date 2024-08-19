import { makeInputAppearanceProps, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeFormFieldProps } from "@/composables/validation.ts";
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

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeInputAppearanceProps(),
        ...makeComponentProps(),
    },
    "EvTextarea",
);
