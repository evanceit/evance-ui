import { makeAppearanceProps, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";

export const makeEvLozengeProps = propsFactory(
    {
        iconEnd: IconProp,
        iconStart: IconProp,
        maxWidth: {
            type: [String, Number],
            default: 200,
        },

        ...makeAppearanceProps(),
        ...makeComponentProps(),
        ...makeTagProps({
            tag: "span",
        }),
    },
    "EvLozenge",
);
