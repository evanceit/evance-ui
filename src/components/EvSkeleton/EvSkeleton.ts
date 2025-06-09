import { HintedString, propsFactory } from "@/util";
import { makeComponentProps, makeDimensionsProps } from "@/composables";
import { PropType } from "vue";
import { makeRoundedProps } from "@/composables/rounded";

export interface EvSkeletonProps {
    shape?: HintedString<"circle" | "rectangle">;
}

export const makeEvSkeletonProps = propsFactory(
    {
        shape: String as PropType<EvSkeletonProps["shape"]>,
        ...makeComponentProps(),
        ...makeDimensionsProps({
            height: "1rem",
        }),
        ...makeRoundedProps({
            rounded: "small",
        }),
    },
    "EvSkeleton",
);