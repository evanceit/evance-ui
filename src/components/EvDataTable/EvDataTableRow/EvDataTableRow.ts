import { EventProp, propsFactory } from "@/util";
import { PropType } from "vue";
import {
    CellProps,
    DataTableItem,
} from "@/components/EvDataTable/composables/types.ts";

export const makeEvDataTableRowProps = propsFactory(
    {
        index: Number,
        selectable: Boolean,
        item: Object as PropType<DataTableItem>,
        cellProps: [Object, Function] as PropType<CellProps<any>>,
        onClick: EventProp<[MouseEvent]>(),
        onContextmenu: EventProp<[MouseEvent]>(),
        onDblclick: EventProp<[MouseEvent]>(),
    },
    "EvDataTableRow",
);
