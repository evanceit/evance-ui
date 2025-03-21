import { propsFactory, TextAppearanceProp } from "@/util";
import { PropType } from "vue";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import { makeTagProps, TagProps } from "@/composables/tag";

export const EvTextSize = {
    small: "small",
    medium: "medium",
    large: "large",
    xLarge: "x-large",
} as const;

export type EvTextSizeProp = (typeof EvTextSize)[keyof typeof EvTextSize];

export const EvTextSizeClass = {
    "x-large": "text-subtitle",
    large: "text-large",
    medium: "text-medium",
    small: "text-small",
} as const;

export type FontWeight = "regular" | "medium" | "semibold" | "bold";

export interface EvTextProps extends ComponentProps, TagProps {
    appearance?: TextAppearanceProp;
    monospace?: boolean;
    size?: EvTextSizeProp;
    text?: string;
    truncate?: number | boolean;
    weight?: FontWeight;
}

export const makeEvTextProps = propsFactory(
    {
        appearance: String as PropType<TextAppearanceProp>,
        monospace: Boolean,
        size: String as PropType<EvTextSizeProp>,
        text: String,
        truncate: [Number, Boolean],
        weight: String as PropType<FontWeight>,
        ...makeComponentProps(),
        ...makeTagProps({
            tag: "p",
        }),
    },
    "EvText",
);
