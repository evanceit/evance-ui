import { Appearance, InputSizeProp, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";
import { PropType } from "vue";
import {
    ButtonAppearanceProp,
    ButtonVariantProp,
    EvButtonProps,
} from "@/components/EvButton/EvButton.ts";

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
