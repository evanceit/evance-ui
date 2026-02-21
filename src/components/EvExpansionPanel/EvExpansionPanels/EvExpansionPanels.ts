import { propsFactory } from "@/util";
import { makeComponentProps, makeTagProps } from "@/composables";
import { makeGroupProps } from "@/composables/group";

export const makeEvExpansionPanelsProps = propsFactory(
    {
        ...makeGroupProps(),
        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvExpansionPanels",
);
