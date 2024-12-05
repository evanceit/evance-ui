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
