import {
    makeInputAppearanceProps,
    makeInputSizeProps,
    makeTextAlignProps,
    propsFactory,
} from "@/util";
import { IconProp } from "@/composables/icons.ts";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { makeComponentProps } from "@/composables/component.ts";
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
