import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables";
import { makeLazyProps } from "@/composables/lazy";

export const makeEvExpansionPanelContentProps = propsFactory(
    {
        noPadding: Boolean,

        ...makeLazyProps(),
        ...makeComponentProps(),
    },
    "EvExpansionPanelContent",
);
