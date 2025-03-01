import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";

export const makeEvSwatchProps = propsFactory(
    {
        ...makeComponentProps(),
    },
    "EvSwatch",
);
