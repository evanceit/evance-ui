import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";

export const makeEvCodeProps = propsFactory(
    {
        text: String,
        ...makeComponentProps(),
    },
    "EvCode",
);