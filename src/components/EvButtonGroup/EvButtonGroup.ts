import { Appearance, InputSizeProp, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";
import { PropType } from "vue";
import {
    ButtonAppearanceProp,
    ButtonVariantProp,
    EvButtonProps,
} from "@/components/EvButton";

export type ButtonGroupGap =
    | "none"
    | "auto"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large";

export const makeEvButtonGroupProps = propsFactory(
    {
        items: {
            type: Array as PropType<readonly EvButtonProps[]>,
            default: () => [],
        },
        appearance: {
            type: String as PropType<ButtonAppearanceProp>,
            default: Appearance.default,
        },
        gap: {
            type: String as PropType<ButtonGroupGap>,
            default: "auto",
        },
        grow: Boolean,
        rounded: Boolean,
        size: String as PropType<InputSizeProp>,
        variant: {
            type: String as PropType<ButtonVariantProp>,
            default: "default",
        },

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvButtonGroup",
);
