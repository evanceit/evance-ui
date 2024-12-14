import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        loading: Boolean,
        search: String,
        searchDelay: {
            type: Number,
            default: 300,
        },
        searchPlaceholder: String,
        hideSelectAll: Boolean,
        ...makeDataTableSortProps(),
    },
    "EvDataTableSearch",
);
