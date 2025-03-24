import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeVirtualProps } from "@/composables/virtual";
import { makeDimensionsProps } from "@/composables/dimensions";
import { makeDataTableItemsProps } from "./composables/items";
import { makeDataTableHeaderProps } from "./composables/headers";
import { makeDataTableSelectProps } from "./composables/select";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch";

export const makeEvDataTableProps = propsFactory(
    {
        loading: Boolean,
        page: { type: Number, default: 1 },
        itemsPerPage: { type: Number, default: 50 },
        showHeaders: Boolean,
        showFinished: {
            type: Boolean,
            default: false,
        },

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
