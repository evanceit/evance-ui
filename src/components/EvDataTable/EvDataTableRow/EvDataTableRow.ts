import { EventProp, propsFactory } from "@/util";
import { PropType } from "vue";
import { DataTableItem } from "@/components/EvDataTable/composables/items.ts";

export const makeEvDataTableRowProps = propsFactory(
    {
        index: Number,
        selectable: Boolean,
        item: Object as PropType<DataTableItem>,
        onClick: EventProp<[MouseEvent]>(),
        onContextmenu: EventProp<[MouseEvent]>(),
        onDblclick: EventProp<[MouseEvent]>(),
    },
    "EvDataTableRow",
);
