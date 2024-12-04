import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        search: String,
        searchPlaceholder: String,
        ...makeDataTableSortProps(),
    },
    "EvDataTableSearch",
);
