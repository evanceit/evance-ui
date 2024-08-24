import { propsFactory } from "@/util";
import { makeSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        selectable: Boolean,
        search: String,
        placeholder: String,
        ...makeSortProps(),
    },
    "EvDataTableSearch",
);
