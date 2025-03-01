import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";

export const makeEvSwatchProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvSwatch",
);
