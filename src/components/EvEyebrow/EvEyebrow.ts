import { makeTextAppearanceProps, propsFactory} from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";

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