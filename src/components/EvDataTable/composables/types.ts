import {
    provideSelection,
    SelectableItem,
} from "@/components/EvDataTable/composables/select.ts";
import { FilterFunction, InternalItem } from "@/composables/filter.ts";
import { GetterPropertyKey } from "@/util";

export type DataTableCompareFunction<T = any> = (a: T, b: T) => number;

export type DataTableHeader = {
    key?:
        | "data-table-select"
        | (string & {});
    value?: GetterPropertyKey;
    title?: string;
    fixed?: boolean;
    align?: "start" | "end" | "center";
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    headerProps?: Record<string, any>;
    cellProps?: HeaderCellProps;
    sortable?: boolean;
    sort?: DataTableCompareFunction;
    filter?: FilterFunction;
    children?: DataTableHeader[];
};

export type InternalDataTableHeader = Omit<
    DataTableHeader,
    "key" | "value" | "children"
> & {
    key: string | null;
    value: GetterPropertyKey | null;
    sortable: boolean;
    fixedOffset?: number;
    lastFixed?: boolean;
    colspan?: number;
    rowspan?: number;
    children?: InternalDataTableHeader[];
};

export interface DataTableItem<T = any>
    extends InternalItem<T>,
        SelectableItem {
    key: any;
    index: number;
    columns: {
        [key: string]: any;
    };
}

type ItemSlotBase<T = any> = {
    index: number;
    item: T;
    internalItem: DataTableItem<T>;
    isSelected: ReturnType<typeof provideSelection>["isSelected"];
    toggleSelect: ReturnType<typeof provideSelection>["toggleSelect"];
};

export type ItemSlot<T = any> = ItemSlotBase<T> & {
    columns: InternalDataTableHeader[];
};

export type ItemKeySlot<T> = ItemSlotBase<T> & {
    value: any;
    column: InternalDataTableHeader;
};

export type RowProps<T> =
    | Record<string, any>
    | ((
          data: Pick<ItemKeySlot<T>, "index" | "item" | "internalItem">,
      ) => Record<string, any>);

export type CellProps<T> =
    | Record<string, any>
    | ((
          data: Pick<
              ItemKeySlot<T>,
              "index" | "item" | "internalItem" | "value" | "column"
          >,
      ) => Record<string, any>);

export type HeaderCellProps =
    | Record<string, any>
    | ((
          data: Pick<
              ItemKeySlot<any>,
              "index" | "item" | "internalItem" | "value"
          >,
      ) => Record<string, any>);
