import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";


export const makeEvEyebrowProps = propsFactory(
    {
        text: String,
        ...makeTagProps({
            tag: "p",
        }),
        ...makeComponentProps(),
    },
    "EvEyebrow",
);