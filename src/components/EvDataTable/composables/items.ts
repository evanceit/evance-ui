import { getPropertyValue, GetterPropertyKey, propsFactory } from "@/util";
import { computed, PropType, Ref } from "vue";
import { provideSelection, SelectableItem } from "./select.ts";
import { InternalDataTableHeader } from "./headers.ts";
import { provideExpanded } from "./expand.ts";

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
    itemValue: GetterPropertyKey;
    itemSelectable?: GetterPropertyKey;
    returnObject: boolean;
}

type ItemSlotBase<T> = {
    index: number;
    item: T;
    internalItem: DataTableItem<T>;
    isExpanded: ReturnType<typeof provideExpanded>["isExpanded"];
    toggleExpand: ReturnType<typeof provideExpanded>["toggleExpand"];
    isSelected: ReturnType<typeof provideSelection>["isSelected"];
    toggleSelect: ReturnType<typeof provideSelection>["toggleSelect"];
};

export type ItemSlot<T> = ItemSlotBase<T> & {
    columns: InternalDataTableHeader[];
};

export type ItemKeySlot<T> = ItemSlotBase<T> & {
    value: any;
    column: InternalDataTableHeader;
};

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
    props: DataTableItemProps,
    columns: Ref<InternalDataTableHeader[]>,
) {
    const items = computed(() =>
        transformItems(props, props.items, columns.value),
    );
    return { items };
}
