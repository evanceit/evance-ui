import { GetterPropertyKey } from "@/util";

export type DataTableHeader = {
    key?: string & {};
    value?: GetterPropertyKey;
    title?: string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
};


export type InternalDataTableHeader = Omit<DataTableHeader, "key" | "value"> & {
    key: string | null;
    value: GetterPropertyKey | null;
};
