import {SequencedPosition} from "./list-sequenced.ts";
import {
    makeSelectedProps,
    Selected,
    SelectStrategyProps,
    useSelectedValues,
    useSelectStrategy
} from "./select-strategies.ts";
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
    toRaw
} from "vue";
import {getCurrentComponent, getNextId, propsFactory} from "../../util";
import {useModelProxy} from "../modelProxy.ts";

/**
 * # Nested Position
 *
 * Typically applies to requests to move a node within the nested data set.
 *
 * 'inside' - Position a node as a child of another node
 */
export type NestedPosition = SequencedPosition & 'inside';


export interface NestedProps extends SelectStrategyProps {

}

type NestedProvide = {
    id: Ref<unknown>,
    isGroupActivator?: boolean,
    root: {
        children: Ref<Map<unknown, unknown[]>>,
        parents: Ref<Map<unknown, unknown>>,
        opened: Ref<Set<unknown>>,
        select: (id: unknown, value: boolean, event?: Event) => void,
        selected: Ref<Map<unknown, Selected>>,
        selectedValues: Ref<unknown[]>,
        register: (id: unknown, parentId: unknown, isGroup?: boolean) => void,
        unregister: (id: unknown) => void,
        open: (id: unknown, value: boolean, event?: Event) => void,
        openOnSelect: (id: unknown, value: boolean, event?: Event) => void
    }
}

export const EvNestedSymbol: InjectionKey<NestedProvide> = Symbol.for('ev:nested');

/**
 * # Empty Nested List
 */
export const emptyNestedList: NestedProvide = {
    id: shallowRef(),
    root: {
        register: () => null,
        unregister: () => null,
        parents: ref(new Map()),
        children: ref(new Map()),
        open: () => null,
        openOnSelect: () => null,
        select: () => null,
        opened: ref(new Set()),
        selected: ref(new Map()),
        selectedValues: ref([])
    }
}

/**
 * # Make Nested Props
 */
export const makeNestedProps = propsFactory({
    ...makeSelectedProps()
}, 'nested');


/**
 * # Use Nested List
 * @param props
 */
export const useNestedList = (props: NestedProps) => {
    let isUnmounted = false;
    const component = getCurrentComponent('nested');
    const children = ref(new Map<unknown, unknown[]>());
    const parents = ref(new Map<unknown, unknown>());
    const selectStrategy = useSelectStrategy(props);
    const selected = useModelProxy(
        props,
        'selected',
        props.selected,
        (values) => {
            return selectStrategy.value.transformIn(values, children.value, parents.value);
        },
        (values) => {
            return selectStrategy.value.transformOut(values, children.value, parents.value);
        }
    );

    onBeforeMount(() => {
        isUnmounted = true;
    });

    function getPath (id: unknown) {
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
                component.emit('click:select', {
                    id,
                    value,
                    path: getPath(id),
                    event
                });
                const newSelected = selectStrategy.value.select({
                    id,
                    value,
                    selected: new Map(selected.value),
                    children: children.value,
                    parents: parents.value,
                    event
                });
                newSelected && (selected.value = newSelected);

                // @todo: open functions
            },
            register: (id, parentId, isGroup) => {
                parentId && id !== parentId && parents.value.set(id, parentId);
                if (isGroup) {
                    children.value.set(id, []);
                }
                if (parentId != null) {
                    children.value.set(parentId, [...children.value.get(parentId) || [], id]);
                }
            },
            unregister: id => {
                if (isUnmounted) {
                    return;
                }
                children.value.delete(id);
                const parent = parents.value.get(id);
                if (parent) {
                    const list = children.value.get(parent) ?? [];
                    children.value.set(parent, list.filter(child => child !== id));
                }
                parents.value.delete(id);
            }
        }
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
        return (id.value !== undefined) ? id.value : idSymbol;
    });
    const item = {
        ...parent,
        id: idComputed,
        parent: computed(() => parent.root.parents.value.get(idComputed.value)),
        select: (selected: boolean, e?: Event) => {
            return parent.root.select(idComputed.value, selected, e);
        },
        isSelected: computed(() => {
            return parent.root.selected.value.get(toRaw(idComputed.value)) === 'on';
        }),
        isIndeterminate: computed(() => {
            return parent.root.selected.value.get(idComputed.value) === 'indeterminate';
        }),
        isLeaf: computed(() => {
            return !parent.root.children.value.get(idComputed.value);
        }),
        isGroupActivator: parent.isGroupActivator
    };
    !parent.isGroupActivator && parent.root.register(idComputed.value, parent.id.value, isGroup);
    onBeforeUnmount(() => {
        !parent.isGroupActivator && parent.root.unregister(idComputed.value);
    });
    if (isGroup) {
        provide(EvNestedSymbol, item);
    }
    return item;
}

/**
 *
 */
export const useNestedGroupActivator = () => {
    const parent = inject(EvNestedSymbol, emptyNestedList)
    provide(EvNestedSymbol, { ...parent, isGroupActivator: true });
}