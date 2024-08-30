import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeDataTableItemsProps } from "@/components/EvDataTable/composables/items.ts";
import { makeVirtualProps } from "@/composables/virtual.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";


export const makeEvDataTableProps = propsFactory(
    {
        ...makeDataTableItemsProps(),
        ...makeDimensionsProps(),
        ...makeVirtualProps(),
        ...makeComponentProps(),
    },
    "EvDataTable",
);
