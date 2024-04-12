import {
    consoleWarn,
    EventProp,
    findChildrenWithProvide,
    getCurrentComponent,
    isDeepEqual,
    propsFactory,
    wrapInArray
} from "@/util";
import {
    ComponentInternalInstance, computed,
    ComputedRef,
    InjectionKey,
    onBeforeUnmount,
    onMounted,
    PropType, provide,
    reactive,
    Ref, toRef,
    UnwrapRef
} from "vue";
import {GroupItem} from "@/composables/groupItem.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";

/**
 * # GroupProps
 */
export interface GroupProps {
    disabled: boolean,
    modelValue: unknown,
    multiple?: boolean,
    mandatory?: boolean | 'force' | undefined,
    max?: number | undefined,
    selectedClass: string | undefined,
    selectedAppearance: string | undefined,
    selectedVariant: string | undefined,
    'onUpdate:modelValue': EventProp<[unknown]> | undefined
}

/**
 * # GroupProvide
 */
export interface GroupProvide {
    register: (item: GroupItem, cmp: ComponentInternalInstance) => void,
    unregister: (id: number) => void,
    select: (id: number, value: boolean) => void,
    selected: Ref<Readonly<number[]>>,
    isSelected: (id: number) => boolean,
    previous: () => void,
    next: () => void,
    selectedClass: Ref<string | undefined>,
    selectedAppearance: Ref<string | undefined>,
    selectedVariant: Ref<string | undefined>,
    items: ComputedRef<{
        id: number
        value: unknown
        disabled: boolean | undefined
    }[]>,
    disabled: Ref<boolean | undefined>,
    getItemIndex: (value: unknown) => number
}


/**
 * # makeGroupProps
 */
export const makeGroupProps = propsFactory({
    modelValue: {
        type: null,
        default: undefined,
    },
    multiple: Boolean,
    mandatory: [Boolean, String] as PropType<boolean | 'force'>,
    max: Number,
    selectedClass: String,
    selectedAppearance: String,
    selectedVariant: String,
    disabled: Boolean,
}, 'group');


/**
 * # getItemIndex
 *
 * @param items
 * @param value
 */
function getItemIndex(items: UnwrapRef<GroupItem[]>, value: unknown): number {
    const ids = getIds(items, [value]);
    if (!ids.length) {
        return -1;
    }
    return items.findIndex(item => item.id === ids[0]);
}


/**
 * ## getIds
 *
 * @param items
 * @param modelValue
 */
function getIds(items: UnwrapRef<GroupItem[]>, modelValue: any[]): number[] {
    const ids: number[] = [];
    modelValue.forEach(value => {
        const item = items.find(item => isDeepEqual(value, item.value));
        const itemByIndex = items[value];
        if (item?.value != null) {
            ids.push(item.id);
        } else if (itemByIndex != null) {
            ids.push(itemByIndex.id);
        }
    });
    return ids;
}


/**
 * ## getValues
 *
 * @param items
 * @param ids
 */
function getValues(items: UnwrapRef<GroupItem[]>, ids: any[]): unknown[] {
    const values: unknown[] = [];
    ids.forEach(id => {
        const itemIndex = items.findIndex(item => item.id === id);
        if (~itemIndex) {
            const item = items[itemIndex];
            values.push(item.value != null ? item.value : itemIndex);
        }
    });
    return values;
}


/**
 * # useGroup
 *
 * @param props
 * @param injectKey
 */
export function useGroup(
    props: GroupProps,
    injectKey: InjectionKey<GroupProvide>
) {
    let isUnmounted = false;
    const items = reactive<GroupItem[]>([]);

    const selected = useModelProxy(
        props,
        'modelValue',
        [],
        value => {
            return (value == null) ? [] : getIds(items, wrapInArray(value));
        },
        value => {
            const values = getValues(items, value);
            return props.multiple ? values : values[0];
        }
    );

    const groupComponent = getCurrentComponent('useGroup');

    function register(item: GroupItem, itemComponent: ComponentInternalInstance) {
        // Is there a better way to fix this typing?
        const unwrapped = item as unknown as UnwrapRef<GroupItem>;
        const key = Symbol.for(`${injectKey.description}:id`);
        const children = findChildrenWithProvide(key, groupComponent?.vnode);
        const index = children.indexOf(itemComponent);

        if (index > -1) {
            items.splice(index, 0, unwrapped);
        } else {
            items.push(unwrapped);
        }
    }

    function unregister(id: number) {
        if (isUnmounted) {
            return;
        }
        // TODO: re-evaluate this line's importance in the future
        // should we only modify the model if mandatory is set.
        // selected.value = selected.value.filter(v => v !== id)
        forceMandatoryValue();

        const index = items.findIndex(item => item.id === id);
        items.splice(index, 1);
    }

    // If mandatory and nothing is selected, then select first non-disabled item
    function forceMandatoryValue () {
        const item = items.find(item => !item.disabled);
        if (item && props.mandatory === 'force' && !selected.value.length) {
            selected.value = [item.id];
        }
    }

    onMounted(() => {
        forceMandatoryValue();
    });

    onBeforeUnmount(() => {
        isUnmounted = true;
    });

    function select(id: number, value?: boolean) {
        const item = items.find(item => item.id === id);
        if (value && item?.disabled) {
            return;
        }

        if (props.multiple) {
            const internalValue = selected.value.slice();
            const index = internalValue.findIndex((v: number)=> v === id);
            const isSelected = ~index;
            value = value ?? !isSelected;

            // We can't remove value if group is mandatory, value already exists, and it is the only value
            if (isSelected && props.mandatory && internalValue.length <= 1) {
                return;
            }

            // We can't add value if it would cause max limit to be exceeded
            if (!isSelected && props.max != null && internalValue.length + 1 > props.max) {
                return;
            }

            if (index < 0 && value) {
                internalValue.push(id);
            } else if (index >= 0 && !value) {
                internalValue.splice(index, 1);
            }

            selected.value = internalValue;
        } else {
            const isSelected = selected.value.includes(id);
            if (props.mandatory && isSelected) {
                return;
            }
            selected.value = (value ?? !isSelected) ? [id] : [];
        }
    }

    function step(offset: number) {
        // getting an offset from selected value obviously won't work with multiple values
        if (props.multiple) {
            consoleWarn('This method is not supported when using "multiple" prop');
        }

        if (!selected.value.length) {
            const item = items.find(item => !item.disabled);
            if (item) {
                selected.value = [item.id];
            }
        } else {
            const currentId = selected.value[0];
            const currentIndex = items.findIndex(i => i.id === currentId);

            let newIndex = (currentIndex + offset) % items.length;
            let newItem = items[newIndex];

            while (newItem.disabled && newIndex !== currentIndex) {
                newIndex = (newIndex + offset) % items.length;
                newItem = items[newIndex];
            }

            if (newItem.disabled) {
                return;
            }
            selected.value = [items[newIndex].id];
        }
    }

    const state: GroupProvide = {
        register,
        unregister,
        selected,
        select,
        disabled: toRef(props, 'disabled'),
        previous: () => step(items.length - 1),
        next: () => step(1),
        isSelected: (id: number) => selected.value.includes(id),
        selectedClass: computed(() => props.selectedClass),
        selectedAppearance: computed(() => props.selectedAppearance),
        selectedVariant: computed(() => props.selectedVariant),
        items: computed(() => items),
        getItemIndex: (value: unknown) => getItemIndex(items, value)
    }

    provide(injectKey, state);

    return state;
}