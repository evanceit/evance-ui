import { Appearance, InputSizeProp, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";
import { PropType } from "vue";
import {
    ButtonAppearanceProp,
    ButtonVariantProp,
    EvButtonProps,
} from "@/components/EvButton";
import { SpacerProp } from "@/components/EvGrid/EvLayout";

export const evButtonGroupGaps = {
    none: 0,
    "x-small": 25,
    small: 50,
    medium: 100,
    large: 150,
    "x-large": 300,
} as const;

export type ButtonGroupGap =
    | "none"
    | "auto"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | SpacerProp;

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
            type: [String, Number, Object] as PropType<ButtonGroupGap>,
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
