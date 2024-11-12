import {
    provideSelection,
    SelectableItem,
} from "@/components/EvDataTable/composables/select.ts";
import { provideExpanded } from "@/components/EvDataTable/composables/expand.ts";
import { FilterFunction, InternalItem } from "@/composables/filter.ts";
import { GetterPropertyKey } from "@/util";
import {
    Group,
    provideGroupBy,
} from "@/components/EvDataTable/composables/group.ts";

export type DataTableCompareFunction<T = any> = (a: T, b: T) => number;

export type DataTableHeader = {
    key?:
        | "data-table-group"
        | "data-table-select"
        | "data-table-expand"
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

export type GroupHeaderSlot = {
    index: number;
    item: Group;
    columns: InternalDataTableHeader[];
    isExpanded: ReturnType<typeof provideExpanded>["isExpanded"];
    toggleExpand: ReturnType<typeof provideExpanded>["toggleExpand"];
    isSelected: ReturnType<typeof provideSelection>["isSelected"];
    toggleSelect: ReturnType<typeof provideSelection>["toggleSelect"];
    toggleGroup: ReturnType<typeof provideGroupBy>["toggleGroup"];
    isGroupOpen: ReturnType<typeof provideGroupBy>["isGroupOpen"];
};

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
