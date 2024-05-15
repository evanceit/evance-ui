import { makeAppearanceProps, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons.ts";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";

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
