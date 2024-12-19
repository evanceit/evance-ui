import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component.ts";
import { makeVirtualProps } from "@/composables/virtual.ts";
import { makeDimensionsProps } from "@/composables/dimensions.ts";
import { makeDataTableItemsProps } from "./composables/items.ts";
import { makeDataTableHeaderProps } from "./composables/headers.ts";
import { makeDataTableSelectProps } from "./composables/select.ts";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch";
import {PropType} from "vue";

export const makeEvDataTableProps = propsFactory(
    {
        loading: Boolean,
        page: { type: Number, default: 1 },
        itemsPerPage: { type: Number, default: 50 },
        showHeaders: Boolean,
        filters: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({}),
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
