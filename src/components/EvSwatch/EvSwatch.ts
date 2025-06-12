import { HintedString, propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeRoundedProps } from "@/composables/rounded";
import { makeSizeProps } from "@/composables/size";

export type SwatchSize = HintedString<
    "x-small" | "small" | "medium" | "large" | "x-large"
>;

export type SwatchType = HintedString<"solid">;

export const makeEvSwatchProps = propsFactory(
    {
        value: String,
        ...makeSizeProps(),
        ...makeRoundedProps({
            rounded: "circle",
        }),
        ...makeComponentProps(),
    },
    "EvSwatch",
);
