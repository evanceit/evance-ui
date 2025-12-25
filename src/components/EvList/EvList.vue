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
import "./EvList.scss";
import { makeEvListProps } from "./EvList";
import { computed, ref, shallowRef } from "vue";
import { focusChild, FocusPosition } from "@/util";
import {
    createList,
    NestedProps,
    useItems,
    useNestedList,
} from "@/composables/lists";
import { useDimensions } from "@/composables/dimensions";
import EvListChildren from "./EvListChildren.vue";

defineEmits(["update:selected", "click:select"]);

const props = defineProps({
    ...makeEvListProps(),
});
const { items } = useItems(props);
const { select } = useNestedList(props as NestedProps);
const containerRef = ref<HTMLElement | undefined>(undefined);
const isFocused = shallowRef(false);
const lastFocus = shallowRef<HTMLElement | undefined>(undefined);
const tabindex = computed(() => {
    return props.disabled || isFocused.value ? -1 : 0;
});
const dimensions = useDimensions(props);

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
        !isFocused.value &&
        !(
            e.relatedTarget &&
            containerRef.value?.contains(e.relatedTarget as Node)
        ) &&
        containerRef.value
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
    const keys: { [key: string]: string } = {
        ArrowDown: "next",
        ArrowUp: "previous",
        Home: "first",
        End: "last",
    };
    const position = keys[e.key];
    if (position && containerRef.value) {
        focus(position as FocusPosition);
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
    select,
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
                'is-disabled': props.disabled,
            },
            props.class,
        ]"
        :style="[props.style, dimensions]"
        :tabindex="tabindex"
        @keydown="onKeyDown"
        @focus="onFocus"
        @focusin="onFocusIn"
        @focusout="onFocusOut">
        <ev-list-children :items="items" :return-object="props.returnObject">
            <slot name="default" />
        </ev-list-children>
    </component>
</template>
