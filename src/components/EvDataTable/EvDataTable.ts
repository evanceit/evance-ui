import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeVirtualProps } from "@/composables/virtual";
import { makeDimensionsProps } from "@/composables/dimensions";
import { makeDataTableItemsProps } from "./composables/items";
import { makeDataTableHeaderProps } from "./composables/headers";
import { makeDataTableSelectProps } from "./composables/select";
import { makeEvDataTableSearchProps } from "./EvDataTableSearch";
import { DataTableItem } from "@/components/EvDataTable/composables/types";
import { PropType } from "vue";
import { InfiniteScrollMode, InfiniteScrollTarget } from "@/components";
import { makeRoundedProps } from "@/composables/rounded";

export type EvDataTableSurface = true | "panel" | undefined;

export const makeEvDataTableProps = propsFactory(
    {
        itemsPerPage: { type: Number, default: 50 },
        infiniteScrollMode: {
            type: String as PropType<InfiniteScrollMode>,
            default: "intersect",
            validator: (v: any) => ["intersect", "manual"].includes(v),
        },
        infiniteScrollTarget: [
            String,
            Object,
        ] as PropType<InfiniteScrollTarget>,
        loading: Boolean,
        page: { type: Number, default: 1 },
        showFinished: {
            type: Boolean,
            default: false,
        },
        showHeaders: Boolean,
        surface: [String, Boolean] as PropType<EvDataTableSurface>,
        rowSurface: [String, Boolean] as PropType<EvDataTableSurface>,
        "onClick:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,
        "onContextmenu:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,
        "onDblclick:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,

        ...makeRoundedProps(),
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
