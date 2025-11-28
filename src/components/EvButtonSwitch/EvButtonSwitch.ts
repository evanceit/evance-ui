import { omit, propsFactory } from "@/util";
import { InjectionKey } from "vue";
import { GroupProvide, makeGroupProps } from "@/composables/group";
import { makeEvButtonProps } from "@/components/EvButton";

export const EvButtonSwitchSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:switch-button");

export const makeEvButtonSwitchProps = propsFactory(
    {
        ...makeEvButtonProps(),
        ...omit(
            makeGroupProps({
                selectedAppearance: "primary",
                selectedVariant: "outlined",
            }),
            ["max", "mandatory", "multiple"],
        ),
        selectedText: String,
    },
    "EvButtonSwitch",
);