import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";
import { PropType } from "vue";
import { VisibilityRuleProp } from "@/composables/display";
import { makeDimensionsProps } from "@/composables";

export const ContainerSize = {
    readable: "readable",
    small: "small",
    medium: "medium",
    large: "large",
} as const;

export type ContainerSizeProp =
    (typeof ContainerSize)[keyof typeof ContainerSize];

/**
 * # makeEvContainerProps
 */
export const makeEvContainerProps = propsFactory(
    {
        hidden: [Boolean, String, Array] as PropType<VisibilityRuleProp>,
        size: String as PropType<ContainerSizeProp>,
        centered: {
            type: Boolean,
            default: true,
        },

        ...makeDimensionsProps(),
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvContainer",
);
