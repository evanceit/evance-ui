import { GroupProvide, makeGroupProps } from "@/composables/group";
import { InjectionKey } from "vue";
import { propsFactory } from "@/util";
import { makeEvButtonGroupProps } from "@/components/EvButtonGroup/EvButtonGroup";

export type SelectButtonSlotProps =
    | "isSelected"
    | "select"
    | "selected"
    | "next"
    | "previous";
export interface DefaultSelectButtonSlot
    extends Pick<GroupProvide, SelectButtonSlotProps> {}

export const EvSelectButtonSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:select-button");

export type EvSelectButtonSlots = {
    default: DefaultSelectButtonSlot;
};

/**
 * # makeEvSelectButtonProps
 */
export const makeEvSelectButtonProps = propsFactory(
    {
        ...makeEvButtonGroupProps({
            gap: "none",
            appearance: "default",
            variant: "outlined",
        }),
        ...makeGroupProps({
            selectedAppearance: "primary",
            selectedVariant: "outlined",
        }),
    },
    "EvSelectButton",
);
