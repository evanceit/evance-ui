import { getPropertyValue, GetterPropertyKey, propsFactory } from "@/util";
import { computed, PropType, Ref } from "vue";
import {
    DataTableItem,
    InternalDataTableHeader,
} from "@/components/EvDataTable/composables/types.ts";

export interface DataTableItemProps {
    items: any[];
    itemValue: GetterPropertyKey;
    itemSelectable?: GetterPropertyKey;
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
    columns: InternalDataTableHeader[],
): DataTableItem {
    const value = props.returnObject
        ? item
        : getPropertyValue(item, props.itemValue);
    const selectable = getPropertyValue(item, props.itemSelectable, true);
    const itemColumns = columns.reduce(
        (obj, column) => {
            if (column.key != null) {
                obj[column.key] = getPropertyValue(item, column.value);
                return obj;
            }
        },
        {} as Record<string, unknown>,
    );
    return {
        key: props.returnObject
            ? getPropertyValue(item, props.itemValue)
            : value,
        index,
        value,
        selectable,
        columns: itemColumns,
        raw: item,
    };
}

export function transformItems(
    props: Omit<DataTableItemProps, "items">,
    items: DataTableItemProps["items"],
    columns: InternalDataTableHeader[],
): DataTableItem[] {
    return items.map((item, index) =>
        transformItem(props, item, index, columns),
    );
}

export function useDataTableItems(
    items,
    props: DataTableItemProps,
    columns: Ref<InternalDataTableHeader[]>,
) {
    const internalItems = computed(() =>
        transformItems(props, items.value, columns.value),
    );
    return { items: internalItems };
}
