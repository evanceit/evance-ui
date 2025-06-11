import { HintedString, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { makeEvImgProps } from "@/components/EvImg";
import { makeRoundedProps } from "@/composables/rounded";
import { PropType } from "vue";

export type ThumbnailSize = HintedString<
    | "xx-small"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
>;

export const thumbnailPresets = {
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
};

export const makeEvThumbnailProps = propsFactory(
    {
        size: String as PropType<ThumbnailSize>,

        ...makeEvImgProps(),
        ...makeRoundedProps(),
        ...makeComponentProps(),
    },
    "EvThumbnail",
);