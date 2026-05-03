import { propsFactory } from "@/util";
import { makeEvCheckboxProps } from "@/components/EvCheckbox";

export const makeEvSwitchProps = propsFactory(
    {
        loading: Boolean,

        ...makeEvCheckboxProps(),
    },
    "EvSwitch",
);
