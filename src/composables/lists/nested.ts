import { SequencedPosition } from "./sequenced";
import {
    makeSelectedProps,
    Selected,
    SelectStrategyProps,
    useSelectedValues,
    useSelectStrategy,
} from "./select-strategies";
import {
    computed,
    inject,
    InjectionKey,
    onBeforeMount,
    onBeforeUnmount,
    provide,
    Ref,
    ref,
    shallowRef,
    toRaw,
} from "vue";
import { getCurrentComponent, getNextId, propsFactory } from "@/util";
import { useModelProxy } from "../modelProxy";
import {
    makeOpenStrategyProps,
    OpenStrategyProps,
    useOpenStrategy,
} from "@/composables/lists/open-strategies";

/**
 * # Nested Position
 *
 * Typically applies to requests to move a node within the nested data set.
 *
 * 'inside' - Position a node as a child of another node
 */
export type NestedPosition = SequencedPosition & "inside";

export interface NestedProps extends SelectStrategyProps, OpenStrategyProps {}

type NestedProvide = {
    id: Ref<unknown>;
    root: {
        children: Ref<Map<unknown, unknown[]>>;
        parents: Ref<Map<unknown, unknown>>;
        opened: Ref<Set<unknown>>;
        select: (id: unknown, value: boolean, event?: Event) => void;
        selected: Ref<Map<unknown, Selected>>;
        selectedValues: Ref<unknown[]>;
        register: (id: unknown, parentId: unknown, isGroup?: boolean) => void;
        unregister: (id: unknown) => void;
        open: (id: unknown, value: boolean, event?: Event) => void;
        openOnSelect: (id: unknown, value: boolean, event?: Event) => void;
        isNested: Ref<boolean>;
    };
};

export const EvNestedSymbol: InjectionKey<NestedProvide> =
    Symbol.for("ev:nested");

/**
 * # Empty Nested List
 */
export const emptyNestedList: NestedProvide = {
    id: shallowRef(),
    root: {
        children: ref(new Map()),
        parents: ref(new Map()),
        opened: ref(new Set()),
        select: () => null,
        selected: ref(new Map()),
        selectedValues: ref([]),
        register: () => null,
        unregister: () => null,
        open: () => null,
        openOnSelect: () => null,
        isNested: ref(false),
    },
};

/**
 * # Make Nested Props
 */
export const makeNestedProps = propsFactory(
    {
        ...makeSelectedProps(),
        ...makeOpenStrategyProps(),
    },
    "nested",
);

/**
 * # Use Nested List
 * @param props
 */
export const useNestedList = (props: NestedProps) => {
    let isUnmounted = false;
    const component = getCurrentComponent("nested");
    const children = ref(new Map<unknown, unknown[]>());
    const parents = ref(new Map<unknown, unknown>());
    const selectStrategy = useSelectStrategy(props);
    const selected: Ref<Map<unknown, Selected>> = useModelProxy(
        props,
        "selected",
        props.selected,
        (values) => {
            return selectStrategy.value.in(
                values,
                children.value,
                parents.value,
            );
        },
        (values) => {
            return selectStrategy.value.out(
                values,
                children.value,
                parents.value,
            );
        },
    );
    const openStrategy = useOpenStrategy(props);
    const opened = useModelProxy(
        props,
        "opened",
        props.opened,
        (values) => {
            return new Set(values);
        },
        (values) => {
            return [...values.values()];
        },
    );

    onBeforeMount(() => {
        isUnmounted = true;
    });

    function getPath(id: unknown) {
        const path: unknown[] = [];
        let parent: unknown = id;
        while (parent != null) {
            path.unshift(parent);
            parent = parents.value.get(parent);
        }
        return path;
    }

    const nested: NestedProvide = {
        id: shallowRef(),
        root: {
            children: children,
            parents: parents,
            selected: selected,
            selectedValues: useSelectedValues(selected),
            select: (id, value, event) => {
                component.emit("click:select", {
                    id,
                    value,
                    path: getPath(id),
                    event,
                });
                const newSelected = selectStrategy.value.select({
                    id,
                    value,
                    selected: new Map(selected.value),
                    children: children.value,
                    parents: parents.value,
                    event,
                });
                newSelected && (selected.value = newSelected);

                nested.root.openOnSelect(id, value, event);
            },
            register: (id, parentId, isGroup) => {
                parentId && id !== parentId && parents.value.set(id, parentId);
                if (isGroup) {
                    children.value.set(id, []);
                }
                if (parentId != null) {
                    children.value.set(parentId, [
                        ...(children.value.get(parentId) || []),
                        id,
                    ]);
                }
            },
            unregister: (id) => {
                if (isUnmounted) {
                    return;
                }
                children.value.delete(id);
                const parent = parents.value.get(id);
                if (parent) {
                    const list = children.value.get(parent) ?? [];
                    children.value.set(
                        parent,
                        list.filter((child) => child !== id),
                    );
                }
                parents.value.delete(id);
            },
            opened: opened,
            open: (id, value, event) => {
                component.emit("click:open", {
                    id,
                    value,
                    path: getPath(id),
                    event,
                });
                const newOpened = openStrategy.value.open({
                    id,
                    value,
                    opened: new Set(opened.value),
                    children: children.value,
                    parents: parents.value,
                    event,
                });
                newOpened && (opened.value = newOpened);
            },
            openOnSelect: (id, value, event) => {
                const newOpened = openStrategy.value.select({
                    id,
                    value,
                    selected: new Map(selected.value),
                    opened: new Set(opened.value),
                    children: children.value,
                    parents: parents.value,
                    event,
                });
                newOpened && (opened.value = newOpened);
            },
            isNested: computed(() => parents.value.size > 0),
        },
    };

    provide(EvNestedSymbol, nested);
    return nested.root;
};

/**
 * # Use Nested List Item
 * @param id
 * @param isGroup
 */
export const useNestedListItem = (id: Ref<unknown>, isGroup: boolean) => {
    const parent = inject(EvNestedSymbol, emptyNestedList);
    const idSymbol = Symbol(getNextId());
    const idComputed = computed(() => {
        return id.value !== undefined ? id.value : idSymbol;
    });
    const item = {
        ...parent,
        id: idComputed,
        open: (open: boolean, e: Event) => {
            parent.root.open(idComputed.value, open, e);
        },
        openOnSelect: (open: boolean, e?: Event) => {
            parent.root.openOnSelect(idComputed.value, open, e);
        },
        isOpen: computed(() => parent.root.opened.value.has(idComputed.value)),
        parent: computed(() => parent.root.parents.value.get(idComputed.value)),
        select: (selected: boolean, e?: Event) => {
            return parent.root.select(idComputed.value, selected, e);
        },
        isSelected: computed(() => {
            return (
                parent.root.selected.value.get(toRaw(idComputed.value)) === "on"
            );
        }),
        isIndeterminate: computed(() => {
            return (
                parent.root.selected.value.get(idComputed.value) ===
                "indeterminate"
            );
        }),
        isLeaf: computed(() => {
            return !parent.root.children.value.get(idComputed.value);
        }),
    };
    parent.root.register(idComputed.value, parent.id.value, isGroup);
    onBeforeUnmount(() => {
        parent.root.unregister(idComputed.value);
    });
    if (isGroup) {
        provide(EvNestedSymbol, item);
    }
    return item;
};

