<script setup lang="ts">
/**
 * # EvSelect
 *
 */
import './EvSelect.scss';
import {makeEvSelectProps} from "./EvSelect.ts";
import {useScrolling} from "./useScrolling.ts";
import {EvTextfield} from "@/components/EvTextfield";
import {EvMenu} from "@/components/EvMenu";
import {EvList, ListItem} from "@/components/EvList";
import {EvListItem} from "@/components/EvListItem";
import {EvVirtualScroll} from "@/components/EvVirtualScroll";
import {EvSurface} from "@/components/EvSurface";
import {useItems} from "@/composables/lists";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {useForm} from "@/composables/form.ts";
import {computed, mergeProps, nextTick, Ref, ref, shallowRef, useSlots, watch} from "vue";
import {filterComponentProps, KeyLogger, wrapInArray} from "@/util";
import {FocusEvent, MouseEvent} from "react";
import {EvTag} from "@/components";

// Props
const props = defineProps(makeEvSelectProps());

defineSlots<{
    label(): any,
    'list-prefix'(): any,
    'list-suffix'(): any,
    item(props: {
        item: any,
        index: number,
        props: any
    }): any,
    'items-empty'(): any,
    'items-prefix'(): any,
    'items-suffix'(): any,
    selection(
        item: any,
        index: number,
    ): any
}>();

const emit = defineEmits([
    'update:focused',
    'update:menuOpen',
    'update:modelValue'
]);

const slots = useSlots();

// TextField
const evTextfieldRef = ref();
const evTextfieldProps = computed(() => {
   return filterComponentProps(EvTextfield, props);
});
const isFocused = shallowRef(false);

// Menu
const evMenuRef = ref<typeof EvMenu>();
const menuOpenProxy = useModelProxy(props, 'menuOpen');
const isMenuOpen = computed({
    get: () => menuOpenProxy.value,
    set: (value) => {
        if (menuOpenProxy.value && !value && evMenuRef.value?.openChildren) {
            return;
        }
        menuOpenProxy.value = value;
    }
});
const isMenuDisabled = computed(() => {
    return (
        (props.hideItemsEmpty && !items.value.length)
        || !!props.readonly
    );
});

// List
const evListRef = ref<typeof EvList>();
const evVirtualScrollRef = ref<typeof EvVirtualScroll>();
const displayItems = computed(() => {
    if (props.hideSelected) {
        return items.value.filter(item => !selections.value.some((s: any) => s === item));
    }
    return items.value;
});
const { items, transformIn, transformOut } = useItems(props);
const model = useModelProxy(
    props,
    "modelValue",
    [],
    (value) => transformIn(value === null ? [null] : wrapInArray(value)),
    (value) => {
        const transformed = transformOut(value);
        return props.multiple ? transformed : (transformed[0] ?? null);
    }
);
const selections = computed(() => {
    return model.value.map((value: any) => {
        return items.value.find((item) => {
            return (props.valueComparator(item.value, value.value));
        }) || value;
    });
});
const selected = computed(() => {
    return selections.value.map((selection: any) => selection.props.value);
});
const keyLogger = new KeyLogger();

let form = useForm();

/**
 * ## On Menu After Leave
 * Maintain focus on the EvSelect when leaving the menu - usually when tabbing out.
 */
function onMenuAfterLeave() {
    if (isFocused.value) {
        evTextfieldRef.value?.focus();
    }
}

/**
 * ## On List Focus In
 * Maintain focus on the select when a menu item is selected.
 * @param e
 */
function onListFocusIn(e:FocusEvent) {
    isFocused.value = true;
}

/**
 * ## One List Mousedown
 * @param e
 */
function onListMouseDown(e: MouseEvent) {
    e.preventDefault();
}

const { onListScroll, onListKeydown } = useScrolling(evListRef, evTextfieldRef);


/**
 * ## On Field Blur
 * @param e
 */
function onFieldBlur(e: FocusEvent) {
    if (!evListRef.value?.$el.contains(e.relatedTarget as HTMLElement)) {
        isMenuOpen.value = false;
    }
}

/**
 * ## On Field Clear
 * When the user clicks on the `clearable` icon.
 * @param e
 */
function onFieldClear(e: MouseEvent) {
    if (props.openOnClear) {
        isMenuOpen.value = true;
    }
}

/**
 * ## On Field Keydown
 * @param e
 */
function onFieldKeydown(e: KeyboardEvent) {
    if (!e.key || props.readonly || form?.isReadonly.value) {
        return;
    }

    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }

    if (['Enter', 'ArrowDown', ' '].includes(e.key)) {
        isMenuOpen.value = true;
    }

    if (['Escape', 'Tab'].includes(e.key)) {
        isMenuOpen.value = false;
    }

    if (e.key === 'Home') {
        evListRef.value?.focus('first');
    } else if (e.key === 'End') {
        evListRef.value?.focus('last');
    }

    if (props.multiple || !keyLogger.log(e)) {
        return;
    }

    const itemIndex = items.value.findIndex(item => item.title.toLowerCase().startsWith(keyLogger.value));
    if (itemIndex >= 0) {
        model.value = [items.value[itemIndex]];
        if (isMenuOpen.value) {
            const scrollIndex = (itemIndex > 0) ? itemIndex - 1 : 0;
            evVirtualScrollRef.value?.scrollToIndex(scrollIndex);
        }
    }
}

/**
 * On Field Mousedown
 */
function onFieldMousedown () {
    if (isMenuDisabled.value) {
        return;
    }
    isMenuOpen.value = !isMenuOpen.value;
}


/**
 * ## Select
 * @param item
 * @param set `null` means toggle
 */
function select(item: ListItem, set: boolean | null = true) {
    if (item.props.disabled) {
        return;
    }

    if (props.multiple) {
        const index = model.value.findIndex((selection: any) => {
            return props.valueComparator(selection.value, item.value);
        });
        const add = set == null ? !~index : set;

        if (~index) {
            const value = add ? [...model.value, item] : [...model.value];
            value.splice(index, 1);
            model.value = value;
        } else if (add) {
            model.value = [...model.value, item];
        }
    } else {
        const add = set !== false;
        model.value = add ? [item] : [];

        nextTick(() => {
            isMenuOpen.value = false;
        })
    }
}

const modelValue = computed(() => {
    return model.value.map((value: any) => value.props.value).join(', ');
});

function onModelValueUpdate(value: any) {
    if (value === null) {
        model.value = [];
    }
}


const { t } = useLocaleFunctions();

/**
 * @param item
 * @param index
 * @param itemRef
 */
function itemProps(item: ListItem, index: number, itemRef: Ref<HTMLElement|undefined>) {
    return mergeProps(item.props, {
        ref: itemRef,
        key: index,
        onClick: () => select(item)
    });
}

/**
 * ## createTagProps
 * @param item
 */
function createTagProps(item: ListItem) {
    return {
        'onClick:close' (e: Event) {
            e.stopPropagation();
            e.preventDefault();
            select(item, false);
        },
        onKeydown (e: KeyboardEvent) {
            if (e.key !== 'Enter' && e.key !== ' ') {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            select(item, false);
        },
        onMousedown (e: MouseEvent) {
            e.preventDefault()
            e.stopPropagation()
        }
    };
}

watch(isFocused, (value, oldValue) => {
    if (value === oldValue) {
        return;
    }
    emit('update:focused', value);
});

</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        :class="[
            'ev-select',
            {
                'is-multiple': props.multiple
            }
        ]"
        v-bind="evTextfieldProps"
        v-bind:modelValue="modelValue"
        v-model:focused="isFocused"
        readonly
        @blur="onFieldBlur"
        @click:clear="onFieldClear"
        @keydown="onFieldKeydown"
        @mousedown:control="onFieldMousedown"
        @update:modelValue="onModelValueUpdate"
    >
        <template #label v-if="props.label || slots.label">
            <slot name="label">{{ props.label }}</slot>
        </template>
        <template #default>
            <div class="ev-select--selected" v-for="(item, index) in selections" :key="item.key">
                <slot name="selection" v-bind="{ item, index }">
                    <ev-tag
                        v-if="props.tags"
                        closable
                        v-bind="createTagProps(item)"
                        :text="item.title"
                    />
                    <span v-else class="ev-select--selected-text">
                        {{ item.title }}
                        <span v-if="props.multiple && (index < selections.length - 1)"
                              class="ev-select--selected-comma">,</span>
                    </span>
                </slot>
            </div>

            <ev-menu
                ref="evMenuRef"
                class="ev-select--menu"
                v-model="isMenuOpen"
                max-height="310"
                :disabled="isMenuDisabled"
                activator="parent"
                :closeOnContentClick="false"
                :openOnClick="false"
                @after-leave="onMenuAfterLeave"
            >
                <ev-surface elevation="overlay" scrollable>
                    <div class="ev-select--list-prefix" v-if="slots['list-prefix']">
                        <slot name="list-prefix" />
                    </div>

                    <ev-list
                        ref="evListRef"
                        class="ev-select--list"
                        :selected="selected"
                        :selectStrategy="props.multiple ? 'multi-any' : 'single-any'"
                        @focusin="onListFocusIn"
                        @keydown="onListKeydown"
                        @mousedown="onListMouseDown"
                        @scroll.passive="onListScroll"
                        tabindex="-1"
                    >
                        <slot name="items-prefix" />

                        <slot name="items-empty" v-if="!displayItems.length && !props.hideItemsEmpty">
                            <ev-list-item :title="t(props.itemsEmptyText)"></ev-list-item>
                        </slot>

                        <ev-virtual-scroll
                            renderless
                            ref="evVirtualScrollRef"
                            :items="displayItems"
                        >
                            <template #default="{ item, index, itemRef }">
                                <slot name="item" v-bind="{ item, index, props: itemProps(item, index, itemRef) }">
                                    <ev-list-item
                                        :ref="itemRef"
                                        v-bind="item.props"
                                        :key="index"
                                        @click="select(item as ListItem, null)"
                                    />
                                </slot>
                            </template>
                        </ev-virtual-scroll>

                        <slot name="items-suffix" />

                    </ev-list>

                    <div class="ev-select--list-suffix" v-if="slots['list-suffix']">
                        <slot name="list-suffix" />
                    </div>
                </ev-surface>
            </ev-menu>

        </template>
    </ev-textfield>

</template>