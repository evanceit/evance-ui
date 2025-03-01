import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";

/**
 * # makeEvSpacerProps
 */
export const makeEvSpacerProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvSpacer",
);
