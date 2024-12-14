import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort.ts";
import { PropType } from "vue";
import { EvButtonProps } from "@/components";

export const makeEvDataTableSearchProps = propsFactory(
    {
        hideSelectAll: Boolean,
        loading: Boolean,
        search: String,
        searchDelay: {
            type: Number,
            default: 300,
        },
        searchPlaceholder: String,
        selectActions: Array as PropType<EvButtonProps[]>,
        ...makeDataTableSortProps(),
    },
    "EvDataTableSearch",
);
