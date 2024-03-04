import {EventProp, getCurrentComponent, getNextId, propsFactory} from "@/util";
import {computed, ExtractPropTypes, inject, InjectionKey, onBeforeUnmount, provide, Ref, toRef, watch} from "vue";
import {GroupProvide} from "@/composables/group.ts";


/**
 * # GroupItem
 */
export interface GroupItem {
    id: number,
    value: Ref<unknown>,
    disabled: Ref<boolean | undefined>
}


/**
 * # GroupItemProvide
 */
export interface GroupItemProvide {
    id: number,
    isSelected: Ref<boolean>,
    toggle: () => void,
    select: (value: boolean) => void,
    selectedClass: Ref<(string | undefined)[] | false>,
    value: Ref<unknown>,
    disabled: Ref<boolean | undefined>,
    group: GroupProvide
}

/**
 * # makeGroupItemProps
 */
export const makeGroupItemProps = propsFactory({
    value: null,
    disabled: Boolean,
    selectedClass: String,
}, 'group-item');


/**
 * # GroupItemProps
 */
export interface GroupItemProps extends ExtractPropTypes<ReturnType<typeof makeGroupItemProps>> {
    'onGroup:selected': EventProp<[{ value: boolean }]> | undefined
}


/**
 * # useGroupItem
 */
export function useGroupItem(
    props: GroupItemProps,
    injectKey: InjectionKey<GroupProvide>,
    required?: boolean,
): GroupItemProvide | null {
    const component = getCurrentComponent('useGroupItem');
    if (!component) {
        throw new Error('Evance UI: `useGroupItem()` composable must be used inside a component setup function');
    }
    const id = getNextId();
    provide(Symbol.for(`${injectKey.description}:id`), id);

    const group = inject(injectKey, null);
    if (!group) {
        if (!required) {
            return group;
        }
        throw new Error(`Evance UI: Could not find \`useGroup()\` injection with symbol '${injectKey.description}'.`);
    }

    const value = toRef(props, 'value');
    const disabled = computed(() => {
        return !!(group.disabled.value || props.disabled);
    });
    const isSelected = computed(() => {
        return group.isSelected(id);
    });
    const selectedClass = computed(() => {
        return isSelected.value && [group.selectedClass.value, props.selectedClass];
    });

    group.register({
        id,
        value,
        disabled,
    }, component);

    onBeforeUnmount(() => {
        group.unregister(id);
    });

    watch(isSelected, value => {
        component.emit('group:selected', { value });
    });

    return {
        id,
        isSelected,
        toggle: () => group.select(id, !isSelected.value),
        select: (value: boolean) => group.select(id, value),
        selectedClass,
        value,
        disabled,
        group
    };
}