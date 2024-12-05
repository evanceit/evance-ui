import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        loading: Boolean,
        search: String,
        searchPlaceholder: String,
        ...makeDataTableSortProps(),
    },
    "EvDataTableSearch",
);
