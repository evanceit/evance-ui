import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeDataTableItemsProps } from "@/components/EvDataTable/composables/items.ts";


export const makeEvDataTableProps = propsFactory(
    {
        ...makeDataTableItemsProps(),
        ...makeComponentProps(),
    },
    "EvDataTable",
);
