import { omit, propsFactory } from "@/util";
import { EvButtonProps, makeEvButtonProps } from "@/components/EvButton";
import { PropType } from "vue";

export type TabDirection = "horizontal" | "vertical";

export interface EvTabProps extends Omit<EvButtonProps, "active" | "symbol"> {
    direction?: TabDirection;
}

/**
 * # makeEvTabProps()
 */
export const makeEvTabProps = propsFactory(
    {
        direction: {
            type: String as PropType<TabDirection>,
            default: "horizontal",
        },

        ...omit(
            makeEvButtonProps({
                variant: "subtle" as const,
                selectedClass: "is-selected",
                selectedAppearance: "primary",
                selectedVariant: "subtle",
            }),
            ["active", "symbol"],
        ),
    },
    "EvTab",
);
