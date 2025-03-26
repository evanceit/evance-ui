import { DataTableItemProps } from "./items";
import { EventProp, isDeepEqual, propsFactory, wrapInArray } from "@/util";
import {
    computed,
    inject,
    InjectionKey,
    PropType,
    provide,
    ref,
    Ref,
    toRef,
} from "vue";
import { useModelProxy } from "@/composables/modelProxy";

export interface SelectableItem {
    value: any;
    selectable: boolean;
}

export interface DataTableSelectStrategy {
    selectable: boolean;
    showSelectAll: boolean;
    allSelected: (data: {
        allItems: SelectableItem[];
    }) => SelectableItem[];
    select: (data: {
        items: SelectableItem[];
        value: boolean;
        selected: Set<unknown>;
        isRequired: boolean;
    }) => Set<unknown>;
    selectAll: (data: {
        value: boolean;
        allItems: SelectableItem[];
        selected: Set<unknown>;
    }) => Set<unknown>;
}

type SelectionProps = Pick<DataTableItemProps, "itemValue"> & {
    selected: readonly any[];
    selectStrategy?: "single" | "multiple" | undefined;
    showSelect: boolean;
    valueComparator: typeof isDeepEqual;
    required: boolean;
    "onUpdate:selected"?: EventProp<[any[]]> | undefined;
};

const singleSelectStrategy: DataTableSelectStrategy = {
    selectable: true,
    showSelectAll: false,
    allSelected: () => [],
    select: ({ items, value, selected, isRequired }) => {
        return new Set(value || isRequired ? [items[0]?.value] : []);
    },
    selectAll: ({ selected }) => selected,
};

const multiSelectStrategy: DataTableSelectStrategy = {
    selectable: true,
    showSelectAll: true,
    allSelected: ({ allItems }) => allItems,
    select: ({ items, value, selected, isRequired }) => {
        for (const item of items) {
            value
                ? selected.add(item.value)
                : !isRequired || selected.size > 1
                  ? selected.delete(item.value)
                  : null;
        }
        return selected;
    },
    selectAll: ({ value, allItems, selected }) =>
        multiSelectStrategy.select({
            items: allItems,
            value,
            selected,
            isRequired: false,
        }),
};

const nullSelectStrategy: DataTableSelectStrategy = {
    selectable: false,
    showSelectAll: false,
    allSelected: () => [],
    select: () => new Set(),
    selectAll: () => new Set(),
};

export const makeDataTableSelectProps = propsFactory(
    {
        required: Boolean,
        showSelect: Boolean,
        selectStrategy: {
            type: [String, Object] as PropType<"single" | "multiple">,
            default: undefined,
        },
        selected: {
            type: Array as PropType<readonly any[]>,
            default: () => [],
        },
        valueComparator: {
            type: Function as PropType<typeof isDeepEqual>,
            default: isDeepEqual,
        },
    },
    "DataTable-select",
);

export const EvDataTableSelectionSymbol: InjectionKey<
    ReturnType<typeof provideSelection>
> = Symbol.for("ev:data-table-selection");

export function provideSelection(
    props: SelectionProps,
    allItems: Ref<SelectableItem[]>,
) {
    const showSelect = toRef(props, "showSelect");
    const isRequired = toRef(props, "required");
    const lastToggledItem = ref<SelectableItem | null>(null);

    const selected = useModelProxy(
        props,
        "selected",
        props.selected,
        (v) => {
            return new Set(
                wrapInArray(v).map((v) => {
                    return (
                        allItems.value.find((item) =>
                            props.valueComparator(v, item.value),
                        )?.value ?? v
                    );
                }),
            );
        },
        (v) => {
            return [...v.values()];
        },
    );

    const allSelectable = computed(() =>
        allItems.value.filter((item) => item.selectable),
    );

    const selectStrategy = computed(() => {
        if (typeof props.selectStrategy === "object") {
            return props.selectStrategy;
        }
        switch (props.selectStrategy) {
            case "single":
                return singleSelectStrategy;
            case "multiple":
                return multiSelectStrategy;
            default:
                return nullSelectStrategy;
        }
    });

    function isSelected(items: SelectableItem | SelectableItem[]) {
        return wrapInArray(items).every((item) =>
            selected.value.has(item.value),
        );
    }

    function isSomeSelected(items: SelectableItem | SelectableItem[]) {
        return wrapInArray(items).some((item) =>
            selected.value.has(item.value),
        );
    }

    function select(items: SelectableItem[], value: boolean) {
        selected.value = selectStrategy.value.select({
            items,
            value,
            selected: new Set(selected.value),
            isRequired: isRequired.value,
        });
    }

    function toggleSelect(item: SelectableItem, shiftPressed: boolean = false) {
        const isItemSelected = isSelected([item]);
        if (lastToggledItem.value && shiftPressed) {
            const lastIndex = allSelectable.value.findIndex((v) => {
                return props.valueComparator(v, lastToggledItem.value);
            });
            const currentIndex = allSelectable.value.findIndex((v) => {
                return props.valueComparator(v, item);
            });
            if (lastIndex === -1 || currentIndex === -1) {
                select([item], !isSelected([item]));
                lastToggledItem.value = selected.value.size > 0 ? item : null;
                return;
            }
            const [start, end] =
                lastIndex < currentIndex
                    ? [lastIndex, currentIndex]
                    : [currentIndex, lastIndex];
            const rangeItems = allSelectable.value.slice(start, end + 1);
            const isLastSelected = isSelected([lastToggledItem.value]);
            const allOpposite = rangeItems.filter(
                (i) => isSelected([i]) !== isLastSelected,
            );
            select(allOpposite, isLastSelected);
            if (isLastSelected === isItemSelected) {
                select([item], !isItemSelected);
            }
        } else {
            select([item], !isSelected([item]));
        }
        lastToggledItem.value = selected.value.size > 0 ? item : null;
    }

    function selectAll(value: boolean) {
        lastToggledItem.value = null;
        selected.value = selectStrategy.value.selectAll({
            value,
            allItems: allSelectable.value,
            selected: new Set(selected.value),
        });
    }

    const someSelected = computed(() => selected.value.size > 0);
    const allSelected = computed(() => {
        const items = selectStrategy.value.allSelected({
            allItems: allSelectable.value,
        });
        return !!items.length && isSelected(items);
    });

    const showSelectAll = computed(
        () => showSelect.value && selectStrategy.value.showSelectAll,
    );

    const data = {
        selected,
        selectStrategy,
        toggleSelect,
        select,
        selectAll,
        isRequired,
        isSelected,
        isSomeSelected,
        someSelected,
        allSelected,
        showSelect,
        showSelectAll,
    };
    provide(EvDataTableSelectionSymbol, data);
    return data;
}

export function useSelection() {
    const data = inject(EvDataTableSelectionSymbol);
    if (!data) {
        throw new Error("Unable to `useSelection()`");
    }
    return data;
}
