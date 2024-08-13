import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvToolbarProps = propsFactory(
    {
        title: String,
        ...makeComponentProps(),
    },
    "EvToolbar",
);
