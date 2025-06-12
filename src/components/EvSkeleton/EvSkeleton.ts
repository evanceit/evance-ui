import { HintedString, propsFactory } from "@/util";
import {
    ComponentProps,
    DimensionsProps,
    makeComponentProps,
    makeDimensionsProps,
} from "@/composables";
import { makeRoundedProps, RoundedProps } from "@/composables/rounded";
import {
    AspectRatioProps,
    makeAspectRatioProps,
} from "@/composables/aspectRatio";
import { PropType } from "vue";

export interface EvSkeletonProps
    extends AspectRatioProps,
        DimensionsProps,
        RoundedProps,
        ComponentProps {
    inline?: boolean;
    type?: SkeletonType;
    size?: SkeletonSize;
}

export type SkeletonType = HintedString<"avatar" | "heading" | "text">;

export type SkeletonSize = HintedString<
    | "xx-small"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
>;

export const skeletonPresets = {
    avatar: {
        defaults: {
            rounded: "circle",
            aspectRatio: 1,
            inline: true,
            width: 42,
        },
        "x-small": { width: 30 },
        small: { width: 36 },
        large: { width: 48 },
        "x-large": { width: 54 },
        "xx-large": { width: 54 },
    },
    button: {
        defaults: {
            rounded: "small",
            height: 42,
            width: 104,
            inline: true,
        },
        "x-small": { height: 32, width: 84 },
        small: { height: 36, width: 92 },
        large: { height: 48, width: 116 },
        "x-large": { height: 56, width: 132 },
        "xx-large": { height: 56, width: 132 },
    },
    heading: {
        defaults: {
            rounded: "small",
            height: "var(--heading-size-4)",
        },
        "x-small": { height: "var(--heading-size-6)" },
        small: { height: "var(--heading-size-5)" },
        large: { height: "var(--heading-size-3)" },
        "x-large": { height: "var(--heading-size-2)" },
        "xx-large": { height: "var(--heading-size-1)" },
    },
    image: {
        defaults: {
            rounded: false,
            aspectRatio: "16:9",
        },
    },
    text: {
        defaults: {
            rounded: "small",
            height: "var(--text-size-medium)",
        },
        "x-small": { height: "var(--text-size-small)" },
        small: { height: "var(--text-size-small)" },
        large: { height: "var(--text-size-large)" },
        "x-large": { height: "var(--text-size-subtitle)" },
        "xx-large": { height: "var(--text-size-subtitle)" },
    },
    thumbnail: {
        defaults: {
            inline: true,
            aspectRatio: 1,
        },
        "xx-small": {
            height: 24,
            rounded: "x-small",
        },
        "x-small": {
            height: 36,
            rounded: "x-small",
        },
        small: {
            height: 48,
            rounded: "small",
        },
        medium: {
            height: 64,
            rounded: "small",
        },
        large: {
            height: 96,
            rounded: "medium",
        },
        "x-large": {
            height: 128,
            rounded: "large",
        },
        "xx-large": {
            height: 256,
            rounded: "large",
        },
    },
};

export const makeEvSkeletonProps = propsFactory(
    {
        inline: {
            type: Boolean,
            required: false,
            default: undefined,
        },
        size: String as PropType<SkeletonSize>,
        type: String as PropType<SkeletonType>,

        ...makeAspectRatioProps(),
        ...makeDimensionsProps(),
        ...makeRoundedProps(),
        ...makeComponentProps(),
    },
    "EvSkeleton",
);
