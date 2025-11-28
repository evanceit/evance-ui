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

export const EvButtonSelectSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:button-select");

export type EvButtonSelectSlots = {
    default: DefaultSelectButtonSlot;
};

/**
 * # makeEvButtonSelectProps
 */
export const makeEvButtonSelectProps = propsFactory(
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
    "EvButtonSelect",
);
