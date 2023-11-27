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
import {makeEvListProps, useListItems} from "./EvList.ts";
import {computed, ref, shallowRef, useSlots} from "vue";
import {focusChild, FocusPosition} from "@/util";
import {createList, useNestedList} from "@/composables/lists";
import {useDimensions} from "@/composables/dimensions.ts";
import EvListChildren from "./EvListChildren.vue";

defineEmits([
    'update:selected',
    'click:select'
]);

const props = defineProps(makeEvListProps());
const slots = useSlots();
const items = useListItems(props);
const { select } = useNestedList(props);
const containerRef = ref<HTMLElement | null>(null);
const isFocused = shallowRef(false);
const lastFocus = shallowRef<HTMLElement | null>(null);
const tabindex = computed(() => {
    return (props.disabled || isFocused.value) ? -1 : 0;
});
const { dimensions } = useDimensions(props);

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
        && !(e.relatedTarget && containerRef.value?.contains(e.relatedTarget as Node))
        && containerRef.value
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
    if (position && containerRef.value) {
        focus(position);
        e.preventDefault();
    }
}

/**
 * # Set Focus
 * @param position
 */
function focus(position?: FocusPosition): void {
    lastFocus.value = focusChild(containerRef?.value, position);
}

defineExpose({
    focus,
    select
});

</script>
<template>
    <component
        :is="props.tag"
        ref="containerRef"
        role="listbox"
        :class="[
            'ev-list',
             {
                 'is-disabled': props.disabled
             },
             props.class
         ]"
        :style="[
            props.style,
            dimensions
        ]"
        :tabindex="tabindex"
        @keydown="onKeyDown"
        @focus="onFocus"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
    >
        <ev-list-children :items="items">
            <slot />
        </ev-list-children>
    </component>
</template>