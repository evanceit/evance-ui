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

export const makeEvDataTableProps = propsFactory(
    {
        loading: Boolean,
        page: { type: Number, default: 1 },
        itemsPerPage: { type: Number, default: 50 },
        showHeaders: Boolean,
        showFinished: {
            type: Boolean,
            default: false,
        },

        "onClick:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,
        "onContextmenu:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,
        "onDblclick:row": Function as PropType<
            (event: PointerEvent, item: DataTableItem) => void
        >,

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
