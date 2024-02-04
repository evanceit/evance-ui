<script setup lang="ts">
/**
 * # EvSelect
 *
 */
import './EvSelect.scss';
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import {computed, ref, shallowRef, useSlots} from "vue";
import {makeEvSelectProps} from "./EvSelect.ts";
import {filterComponentProps, KeyLogger, wrapInArray} from "@/util";
import {EvMenu} from "../EvMenu";
import EvList from "../EvList/EvList.vue";
import {useItems} from "@/composables/lists";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {FocusEvent, MouseEvent} from "react";
import EvVirtualScroll from "@/components/EvVirtualScroll/EvVirtualScroll.vue";
import EvListItem from "@/components/EvListItem/EvListItem.vue";
import {ListItem} from "@/components/EvList";
import {useScrolling} from "./useScrolling.ts";
import {useLocaleFunctions} from "@/composables/locale.ts";

// Props
const props = defineProps(makeEvSelectProps());
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
        (props.hideNoItems && !items.value.length)
        || props.readonly
    );
});

// List
const evListRef = ref<typeof EvList>();
const evVirtualScrollRef = ref<typeof EvVirtualScroll>();
const displayItems = computed(() => {
    if (props.hideSelected) {
        return items.value.filter(item => !selections.value.some(s => s === item));
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
    return model.value.map((value) => {
        return items.value.find((item) => {
            return (props.valueComparator(item.value, value.value));
        }) || value;
    });
});
const selected = computed(() => {
    return selections.value.map(selection => selection.props.value);
});
const keyLogger = new KeyLogger();

let form; // @todo: <--- YOU ARE HERE (forms and validation)

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
    if (props.readonly || form?.isReadonly.value) {
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
 */
function select(item: ListItem) {
    if (props.multiple) {
        const index = selected.value.findIndex(selection => {
            return props.valueComparator(selection, item.value);
        });
        if (index === -1) {
            model.value = [...model.value, item];
        } else {
            const value = [...model.value];
            value.splice(index, 1);
            model.value = value;
        }
    } else {
        model.value = [item];
        isMenuOpen.value = false;
    }
}

const modelValue = computed(() => {
    return model.value.map(value => value.props.value).join(', ');
});

function onModelValueUpdate(value) {
    if (value === null) {
        model.value = [];
    }
}


const { t } = useLocaleFunctions();

</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        class="ev-select"
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
            <div class="ev-select--selected">
                <span
                    class="ev-select--selected-text"
                    v-for="(item, index) in selections"
                >
                    {{ item.title }}
                    <span v-if="props.multiple && (index < selections.length - 1)"
                          class="ev-select-seelected-comma">,</span>
                </span>
            </div>

            <ev-menu
                ref="evMenuRef"
                v-model="isMenuOpen"
                max-height="310"
                :disabled="isMenuDisabled"
                activator="parent"
                :closeOnContentClick="false"
                :openOnClick="false"
                @after-leave="onMenuAfterLeave"
            >
                <ev-list
                    ref="evListRef"
                    :selected="selected"
                    :selectStrategy="props.multiple ? 'multi-any' : 'single-any'"
                    @focusin="onListFocusIn"
                    @keydown="onListKeydown"
                    @mousedown="onListMouseDown"
                    @scroll.passive="onListScroll"
                    tabindex="-1"
                >
                    <slot name="no-items" v-if="!displayItems.length && !props.hideNoItems">
                        <ev-list-item :title="t(props.noItemsText)"></ev-list-item>
                    </slot>

                    <ev-virtual-scroll renderless
                                       ref="evVirtualScrollRef"
                                       :items="displayItems"
                    >
                        <template #default="{ item, index }">
                            <ev-list-item
                                v-bind="item as ListItem"
                                :key="index"
                                @click="select(item as ListItem)"
                            />
                        </template>
                    </ev-virtual-scroll>
                </ev-list>
            </ev-menu>
        </template>
    </ev-textfield>

</template>