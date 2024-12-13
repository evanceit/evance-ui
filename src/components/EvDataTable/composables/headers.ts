import {
    capitalize,
    DeepReadonly,
    inject,
    InjectionKey,
    PropType,
    provide,
    ref,
    Ref,
    watchEffect,
} from "vue";
import { GetterPropertyKey, isBoolean, isEmpty, propsFactory } from "@/util";
import { FilterKeyFunctions } from "@/composables/filter.ts";
import {
    DataTableCompareFunction,
    DataTableHeader,
    InternalDataTableHeader,
} from "@/components/EvDataTable/composables/types.ts";
import {
    DisplayInstance,
    DisplayRuleListProp,
    useDisplay,
} from "@/composables/display.ts";

type HeaderProps = {
    headers?: DeepReadonly<DataTableHeader[]> | undefined;
    items: any[];
};

export const makeDataTableHeaderProps = propsFactory(
    {
        headers: Array as PropType<DeepReadonly<DataTableHeader[]>>,
    },
    "EvDataTable-header",
);

export const EvDataTableHeadersSymbol: InjectionKey<{
    headers: Ref<InternalDataTableHeader[][]>;
    columns: Ref<InternalDataTableHeader[]>;
}> = Symbol.for("ev:data-table-headers");

function priorityQueue<T>(arr: T[] = []) {
    const queue: { element: T; priority: number }[] = arr.map((element) => ({
        element,
        priority: 0,
    }));

    return {
        enqueue: (element: T, priority: number) => {
            let added = false;
            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                if (item.priority > priority) {
                    queue.splice(i, 0, { element, priority });
                    added = true;
                    break;
                }
            }
            if (!added) {
                queue.push({ element, priority });
            }
        },
        size: () => queue.length,
        count: () => {
            let count = 0;
            if (!queue.length) {
                return 0;
            }
            const whole = Math.floor(queue[0].priority);
            for (let i = 0; i < queue.length; i++) {
                if (Math.floor(queue[i].priority) === whole) count += 1;
            }
            return count;
        },
        dequeue: () => {
            return queue.shift();
        },
    };
}

function extractLeaves(
    item: InternalDataTableHeader,
    columns: InternalDataTableHeader[] = [],
) {
    if (!item.children) {
        columns.push(item);
    } else {
        for (const child of item.children) {
            extractLeaves(child as InternalDataTableHeader, columns);
        }
    }
    return columns;
}

function getDepth(item: InternalDataTableHeader, depth = 0): number {
    if (!item.children) {
        return depth;
    }
    return Math.max(
        depth,
        ...item.children.map((child) =>
            getDepth(child as InternalDataTableHeader, depth + 1),
        ),
    );
}

function parseFixedColumns(items: InternalDataTableHeader[]) {
    let seenFixed = false;
    function setFixed(item: InternalDataTableHeader, parentFixed = false) {
        if (!item) {
            return;
        }
        if (parentFixed) {
            item.fixed = true;
        }
        if (item.fixed) {
            if (item.children) {
                for (let i = item.children.length - 1; i >= 0; i--) {
                    setFixed(item.children[i] as InternalDataTableHeader, true);
                }
            } else {
                if (!seenFixed) {
                    item.lastFixed = true;
                } else if (isNaN(+item.width!)) {
                    console.error(
                        `Multiple fixed columns should have a static width (key: ${item.key})`,
                    );
                }
                seenFixed = true;
            }
        } else {
            if (item.children) {
                for (let i = item.children.length - 1; i >= 0; i--) {
                    setFixed(item.children[i]);
                }
            } else {
                seenFixed = false;
            }
        }
    }

    for (let i = items.length - 1; i >= 0; i--) {
        setFixed(items[i]);
    }

    function setFixedOffset(item: InternalDataTableHeader, fixedOffset = 0) {
        if (!item) {
            return fixedOffset;
        }
        if (item.children) {
            item.fixedOffset = fixedOffset;
            for (const child of item.children) {
                fixedOffset = setFixedOffset(child, fixedOffset);
            }
        } else if (item.fixed) {
            item.fixedOffset = fixedOffset;
            fixedOffset += parseFloat(item.width?.toString() || "0") || 0;
        }
        return fixedOffset;
    }

    let fixedOffset = 0;
    for (const item of items) {
        fixedOffset = setFixedOffset(item, fixedOffset);
    }
}

function parse(items: InternalDataTableHeader[], maxDepth: number) {
    const headers: InternalDataTableHeader[][] = [];
    let currentDepth = 0;
    const queue = priorityQueue(items);

    while (queue.size() > 0) {
        let rowSize = queue.count();
        const row: InternalDataTableHeader[] = [];
        let fraction = 1;
        while (rowSize > 0) {
            const { element: item, priority } = queue.dequeue()!;
            const diff = maxDepth - currentDepth - getDepth(item);

            row.push({
                ...item,
                rowspan: diff ?? 1,
                colspan: item.children ? extractLeaves(item).length : 1,
            });

            if (item.children) {
                for (const child of item.children) {
                    // This internally sorts items that are on the same priority "row"
                    const sort =
                        (priority % 1) +
                        fraction / Math.pow(10, currentDepth + 1);
                    queue.enqueue(child, currentDepth + diff + sort);
                }
            }

            fraction += 1;
            rowSize -= 1;
        }
        currentDepth += 1;
        headers.push(row);
    }
    const columns = items.map((item) => extractLeaves(item)).flat();
    return { columns, headers };
}

/**
 * # `convertToInternalHeaders`
 *
 * Convert the header items supplied to the table to items we
 * can use internally.
 *
 * @param items
 * @param display
 */
function convertToInternalHeaders(
    items: DeepReadonly<DataTableHeader[]>,
    display: DisplayInstance,
) {
    const internalHeaders: InternalDataTableHeader[] = [];
    for (const item of items) {
        if (!isEmpty(item.hidden)) {
            if (isBoolean(item.hidden) && !!item.hidden) {
                continue;
            }
            if (
                !isBoolean(item.hidden) &&
                display.hasActiveRule(item.hidden as DisplayRuleListProp)
            ) {
                continue;
            }
        }
        const defaultItem = { ...item };
        const key =
            defaultItem.key ??
            (typeof defaultItem.value === "string" ? defaultItem.value : null);
        const value = defaultItem.value ?? key ?? null;
        const internalItem: InternalDataTableHeader = {
            ...defaultItem,
            key,
            value: value as GetterPropertyKey,
            sortable:
                defaultItem.sortable ??
                (defaultItem.key != null || !!defaultItem.sort),
            children: defaultItem.children
                ? convertToInternalHeaders(defaultItem.children)
                : undefined,
        };
        internalHeaders.push(internalItem);
    }
    return internalHeaders;
}

export function createHeaders(props: HeaderProps) {
    const headers = ref<InternalDataTableHeader[][]>([]);
    const columns = ref<InternalDataTableHeader[]>([]);
    const sortFunctions = ref<Record<string, DataTableCompareFunction>>();
    const filterFunctions = ref<FilterKeyFunctions>();
    const display = useDisplay();

    watchEffect(() => {
        const _headers =
            props.headers ||
            (Object.keys(props.items[0] ?? {}).map((key) => ({
                key,
                title: capitalize(key),
            })) as never);

        const items = _headers.slice();
        const internalHeaders = convertToInternalHeaders(items, display);
        parseFixedColumns(internalHeaders);
        const maxDepth =
            Math.max(...internalHeaders.map((item) => getDepth(item))) + 1;
        const parsed = parse(internalHeaders, maxDepth);

        headers.value = parsed.headers;
        columns.value = parsed.columns;

        const flatHeaders = parsed.headers.flat(1);

        sortFunctions.value = flatHeaders.reduce(
            (acc, header) => {
                if (header.sortable && header.key && header.sort) {
                    acc[header.key] = header.sort;
                }
                return acc;
            },
            {} as Record<string, DataTableCompareFunction>,
        );

        filterFunctions.value = flatHeaders.reduce((acc, header) => {
            if (header.key && header.filter) {
                acc[header.key] = header.filter;
            }
            return acc;
        }, {} as FilterKeyFunctions);
    });

    const data = { headers, columns, sortFunctions, filterFunctions };
    provide(EvDataTableHeadersSymbol, data);
    return data;
}

export function useHeaders() {
    const data = inject(EvDataTableHeadersSymbol);
    if (!data) {
        throw new Error("Unable to `useHeaders()`.");
    }
    return data;
}
