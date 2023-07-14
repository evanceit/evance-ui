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
import {createList} from "../../composables/lists.ts";

const props = defineProps(makeEvListProps());
const slots = useSlots();
const items = useListItems(props);
const container = ref<HTMLElement | null>(null);
const isFocused = shallowRef(false);
const tabindex = computed(() => {
    return (props.disabled || isFocused.value) ? -1 : 0;
});

/**
 * Establish provide() and inject() functionality for list items.
 */
createList();



function onFocus(e: FocusEvent): void {
    if (
        !isFocused.value
        && !(e.relatedTarget && container.value?.contains(e.relatedTarget as Node))
    ) {
        console.log('onFocus');
    }
}

function onFocusIn(e: FocusEvent): void {
    isFocused.value = true;
}

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
        setFocus(position);
        e.preventDefault();
    }
}

/**
 * # Set Focus
 * @param position
 */
function setFocus(position?: FocusPosition): void {
    focusChild(container?.value, position);
}

</script>
<template>
    <component
        :is="props.tag"
        ref="container"
        class="ev-list"
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