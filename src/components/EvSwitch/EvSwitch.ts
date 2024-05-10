import { propsFactory } from "@/util";
import { makeEvCheckboxProps } from "@/components/EvCheckbox";

export const makeEvSwitchProps = propsFactory(
    {
        ...makeEvCheckboxProps(),
    },
    "EvSwitch",
);
