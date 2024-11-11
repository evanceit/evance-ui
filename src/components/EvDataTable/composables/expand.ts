import { propsFactory } from "@/util";
import { InjectionKey, PropType, Ref, toRef, provide, inject } from "vue";
import { DataTableItem } from "./items.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";

export const makeDataTableExpandProps = propsFactory(
    {
        expandOnClick: Boolean,
        showExpand: Boolean,
        expanded: {
            type: Array as PropType<readonly string[]>,
            default: () => ([]),
        },
    },
    "EvDataTable-expand",
);

export const DataTableExpandedKey: InjectionKey<{
    expand: (item: DataTableItem, value: boolean) => void;
    expanded: Ref<Set<string>>;
    expandOnClick: Ref<boolean | undefined>;
    isExpanded: (item: DataTableItem) => boolean;
    toggleExpand: (item: DataTableItem) => void;
}> = Symbol.for("ev:datatable:expanded");

type ExpandProps = {
    expandOnClick: boolean;
    expanded: readonly string[];
    "onUpdate:expanded": ((value: any[]) => void) | undefined;
};

export function provideExpanded(props: ExpandProps) {
    const expandOnClick = toRef(props, "expandOnClick");
    const expanded = useModelProxy(
        props,
        "expanded",
        props.expanded,
        (v) => new Set(v),
        (v) => [...v.values()],
    );

    function expand(item: DataTableItem, value: boolean) {
        const newExpanded = new Set(expanded.value);
        if (!value) {
            newExpanded.delete(item.value);
        } else {
            newExpanded.add(item.value);
        }
        expanded.value = newExpanded;
    }

    function isExpanded(item: DataTableItem) {
        return expanded.value.has(item.value);
    }

    function toggleExpand(item: DataTableItem) {
        expand(item, !isExpanded(item));
    }

    const data = { expand, expanded, expandOnClick, isExpanded, toggleExpand };
    provide(DataTableExpandedKey, data);
    return data;
}

export function useExpand() {
    const data = inject(DataTableExpandedKey);
    if (!data) {
        throw new Error("Unable to `useExpand()`.");
    }
    return data;
}