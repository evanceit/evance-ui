import { omit, propsFactory } from "@/util";
import { InjectionKey } from "vue";
import { GroupProvide, makeGroupProps } from "@/composables/group";
import { makeEvButtonProps } from "@/components/EvButton";

export const EvSwitchButtonSymbol: InjectionKey<GroupProvide> =
    Symbol.for("ev:switch-button");

export const makeEvSwitchButtonProps = propsFactory(
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
    "EvSwitchButton",
);