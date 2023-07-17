<script setup lang="ts">
/**
 * # EvList
 *
 * `<ev-list>`
 *
 * Uses:
 * - EvListItem - `<ev-list-item>`
 *
 * @todo: Nested items
 *
 * @see EvListItem
 */
import './EvList.scss';
import {makeEvListProps, useListItems} from "./EvList.props.ts";
import EvListItem from "../EvListItem/EvListItem.vue";
import {computed, ref, shallowRef, useSlots} from "vue";
import {focusChild, FocusPosition} from "../../util";
import {createList, useNestedList} from "../../composables/lists";

const props = defineProps(makeEvListProps());
const slots = useSlots();
const items = useListItems(props);
const { select } = useNestedList(props);
const container = ref<HTMLElement | null>(null);
const isFocused = shallowRef(false);
const lastFocus = shallowRef<HTMLElement | null>(null);
const tabindex = computed(() => {
    return (props.disabled || isFocused.value) ? -1 : 0;
});

defineEmits([
    'update:selected',
    'click:select'
]);

/**
 * Establish provide() and inject() functionality for list items.
 */
createList();

/**
 * # On Focus
 * Set or restore focus
 * @param e
 */
function onFocus(e: FocusEvent): void {
    if (
        !isFocused.value
        && !(e.relatedTarget && container.value?.contains(e.relatedTarget as Node))
        && container.value
    ) {
        if (lastFocus.value) {
            lastFocus.value.focus();
        } else {
            focus();
        }
    }
}

/**
 * # On Focus In
 * @param e
 */
function onFocusIn(e: FocusEvent): void {
    isFocused.value = true;
}

/**
 * # On Focus Out
 * @param e
 */
function onFocusOut(e: FocusEvent): void {
    isFocused.value = false;
}

/**
 * # On Key Down
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 * @param e
 */
function onKeyDown(e: KeyboardEvent): void {
    const keys = {
        'ArrowDown': 'next',
        'ArrowUp': 'previous',
        'Home': 'first',
        'End': 'last'
    };
    const position = keys[e.key];
    if (position && container.value) {
        focus(position);
        e.preventDefault();
    }
}

/**
 * # Set Focus
 * @param position
 */
function focus(position?: FocusPosition): void {
    lastFocus.value = focusChild(container?.value, position);
}

defineExpose({
    focus,
    select
});

</script>
<template>
    <component
        :is="props.tag"
        ref="container"
        class="ev-list"
        role="listbox"
        :class="[
             {
                 'is-disabled': props.disabled
             }
         ]"
        :tabindex="tabindex"
        @keydown="onKeyDown"
        @focus="onFocus"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
    >
        <ev-list-item
            v-for="item in items"
            v-bind="item.props"
        >
        </ev-list-item>
    </component>
</template>