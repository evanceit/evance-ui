import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { IconProp } from "@/composables/icons.ts";

export type EvToolbarSize = "medium" | "large";

export const makeEvToolbarProps = propsFactory(
    {
        icon: IconProp,
        title: String,
        ...makeComponentProps(),
    },
    "EvToolbar",
);
