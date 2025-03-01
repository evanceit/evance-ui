import {
    makeInputAppearanceProps,
    makeInputSizeProps,
    makeTextAlignProps,
    propsFactory,
} from "@/util";
import { IconProp } from "@/composables/icons";
import { makeFormFieldProps } from "@/composables/validation";
import { makeComponentProps } from "@/composables/component";
import { makeLabelProps } from "@/components/EvLabel";

/**
 * # Make EvTextfield Props
 */
export const makeEvTextfieldProps = propsFactory(
    {
        autofocus: Boolean,
        autoselect: Boolean,
        clearable: Boolean,
        iconStart: IconProp,
        iconEnd: IconProp,
        loading: Boolean,
        placeholder: String,
        prefix: String,
        role: String,
        rounded: Boolean,
        suffix: String,
        type: {
            type: String,
            default: "text",
        },
        monospace: Boolean,

        ...makeLabelProps(),
        ...makeTextAlignProps(),
        ...makeFormFieldProps(),
        ...makeInputAppearanceProps(),
        ...makeInputSizeProps(),
        ...makeComponentProps(),
    },
    "EvTextfield",
);
