import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvFieldHelpProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvFieldHelp",
);
