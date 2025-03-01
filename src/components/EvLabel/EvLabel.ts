import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";

export const makeLabelProps = propsFactory(
    {
        label: String,
        hint: String,
    },
    "Label",
);

export const makeEvLabelProps = propsFactory(
    {
        title: String,
        hint: String,
        clickable: Boolean,

        ...makeComponentProps(),
    },
    "EvLabel",
);
