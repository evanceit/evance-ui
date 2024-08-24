import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeTagProps } from "@/composables/tag.ts";

export const makeEvSectionProps = propsFactory(
    {
        title: String,

        ...makeComponentProps(),
        ...makeTagProps(),
    },
    "EvSection",
);
