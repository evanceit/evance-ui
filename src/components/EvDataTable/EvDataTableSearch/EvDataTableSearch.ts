import { propsFactory } from "@/util";
import { makeDataTableSortProps } from "../composables/sort";
import { PropType } from "vue";
import { EvButtonProps } from "@/components/EvButton";

export const makeEvDataTableSearchProps = propsFactory(
    {
        filters: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({}),
        },
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
