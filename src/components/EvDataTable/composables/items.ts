import {GetterPropertyKey, propsFactory} from "@/util";
import { PropType } from "vue";
import { SelectableItem } from "@/components/EvDataTable/composables/select.ts";

export interface InternalItem<T = any> {
    value: any;
    raw: T;
}

export interface DataTableItem<T = any>
    extends InternalItem<T>,
        SelectableItem {
    key: any;
    index: number;
    columns: {
        [key: string]: any;
    };
}

export interface DataTableItemProps {
    items: any[];
    returnObject: boolean;
}

export const makeDataTableItemsProps = propsFactory(
    {
        items: {
            type: Array as PropType<DataTableItemProps["items"]>,
            default: () => [],
        },
        itemValue: {
            type: [String, Array, Function] as PropType<GetterPropertyKey>,
            default: "id",
        },
        itemSelectable: {
            type: [String, Array, Function] as PropType<GetterPropertyKey>,
            default: null,
        },
        returnObject: Boolean,
    },
    "data-table-items",
);

export function transformItem(
    props: Omit<DataTableItemProps, "items">,
    item: any,
    index: number,
) {

}
