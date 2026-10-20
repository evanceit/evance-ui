import { propsFactory } from "@/util";
import { makeComponentProps, makeTagProps } from "@/composables";

export const makeEvTableProps = propsFactory(
    {
        hoverable: Boolean,

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvTable",
);
