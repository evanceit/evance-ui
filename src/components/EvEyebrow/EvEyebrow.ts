import { makeTextAppearanceProps, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";

export const makeEvEyebrowProps = propsFactory(
    {
        text: String,
        ...makeTextAppearanceProps(),
        ...makeTagProps({
            tag: "p",
        }),
        ...makeComponentProps(),
    },
    "EvEyebrow",
);