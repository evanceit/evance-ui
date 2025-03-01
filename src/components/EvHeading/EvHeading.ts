import { propsFactory } from "@/util";
import { makeTagProps } from "@/composables/tag";
import { makeComponentProps } from "@/composables/component";
import { PropType } from "vue";

export const EvHeadingSize = {
    default: "medium",
    xSmall: "x-small",
    small: "small",
    medium: "medium",
    large: "large",
    xLarge: "x-large",
    xxLarge: "xx-large",
} as const;

export type EvHeadingSizeProp =
    (typeof EvHeadingSize)[keyof typeof EvHeadingSize];

export const EvHeadingTag = {
    "xx-large": "h1",
    "x-large": "h2",
    large: "h3",
    medium: "h4",
    small: "h5",
    "x-small": "h6",
} as const;

export const EvHeadingClass = {
    "xx-large": "heading-1",
    "x-large": "heading-2",
    large: "heading-3",
    medium: "heading-4",
    small: "heading-5",
    "x-small": "heading-6",
} as const;

export const makeEvHeadingProps = propsFactory(
    {
        size: {
            type: String as PropType<EvHeadingSizeProp>,
            default: EvHeadingSize.default,
        },
        text: String,
        truncate: [Number, Boolean],
        ...makeComponentProps(),
        ...makeTagProps({
            tag: undefined,
        }),
    },
    "EvHeading",
);