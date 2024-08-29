import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        selectable: Boolean,
        search: String,
        placeholder: String,

        ...makeDataTableSortProps(),
    },
    "EvDataTableSearch",
);
