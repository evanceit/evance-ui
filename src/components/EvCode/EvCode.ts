import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvCodeProps = propsFactory(
    {
        text: String,
        ...makeComponentProps(),
    },
    "EvCode",
);