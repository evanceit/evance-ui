import { GroupProvide, makeGroupProps } from "@/composables/group";
import { InjectionKey } from "vue";
import { propsFactory } from "@/util";
import { makeEvButtonGroupProps } from "@/components/EvButtonGroup/EvButtonGroup";

export type ButtonToggleSlotProps =
    | "isSelected"
    | "select"
    | "selected"
    | "next"
    | "previous";
export interface DefaultButtonToggleSlot
    extends Pick<GroupProvide, ButtonToggleSlotProps> {}

export const EvButtonToggleSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:button-toggle");

export type EvButtonToggleSlots = {
    default: DefaultButtonToggleSlot;
};

/**
 * # makeEvButtonToggleProps
 */
export const makeEvButtonToggleProps = propsFactory(
    {
        ...makeEvButtonGroupProps({
            gap: "none",
        }),
        ...makeGroupProps({
            selectedAppearance: "primary",
            selectedVariant: "tonal",
        }),
    },
    "EvButtonToggle",
);
