import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeTagProps } from "@/composables/tag";

export const makeEvSectionProps = propsFactory(
    {
        title: String,

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvSection",
);
