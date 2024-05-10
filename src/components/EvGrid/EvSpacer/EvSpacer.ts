import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";

/**
 * # makeEvSpacerProps
 */
export const makeEvSpacerProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvSpacer",
);
