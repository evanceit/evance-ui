import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeVirtualProps } from "@/composables/virtual.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { makeDataTableItemsProps } from "./composables/items.ts";
import { makeDataTableHeaderProps } from "./composables/headers.ts";
import { makeDataTableSelectProps } from "./composables/select.ts";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch";

export const makeEvDataTableProps = propsFactory(
    {
        loading: Boolean,
        page: { type: Number, default: 1 },
        itemsPerPage: { type: Number, default: 50 },
        showHeaders: Boolean,

        ...makeEvDataTableSearchProps(),
        ...makeDataTableHeaderProps(),
        ...makeDataTableItemsProps(),
        ...makeDataTableSelectProps(),
        ...makeDimensionsProps(),
        ...makeVirtualProps(),
        ...makeComponentProps(),
    },
    "EvDataTable",
);
