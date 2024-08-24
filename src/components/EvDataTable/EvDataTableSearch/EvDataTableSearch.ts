import { propsFactory } from "@/util";
import { makeSortProps } from "../composables/sort.ts";

export const makeEvDataTableSearchProps = propsFactory(
    {
        selectable: Boolean,
        ...makeSortProps(),
    },
    "EvDataTableSearch",
);
