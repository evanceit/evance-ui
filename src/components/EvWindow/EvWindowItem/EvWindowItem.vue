<script setup lang="ts">
/**
 * EvWindowItem
 */
import { computed, inject, nextTick, shallowRef } from "vue";
import { makeEvWindowItemProps } from "./EvWindowItem.ts";
import { EvWindowGroupSymbol, EvWindowSymbol } from "../EvWindow.ts";
import { EvTransition } from "@/components/EvTransition";
import { GroupItemProps, useGroupItem } from "@/composables/groupItem.ts";
import { useSsrBoot } from "@/composables/ssrBoot.ts";
import { isString, toWebUnit } from "@/util";
import { useLazy } from "@/composables/lazy.ts";

const props = defineProps(makeEvWindowItemProps());
const window = inject(EvWindowSymbol);
const groupItem = useGroupItem(
    props as any as GroupItemProps,
    EvWindowGroupSymbol,
);
const { isBooted } = useSsrBoot();

if (!window || !groupItem) {
    throw new Error("Evance UI: EvWindowItem must be used inside EvWindow");
}

const isTransitioning = shallowRef(false);
const hasTransition = computed(
    () =>
        isBooted.value &&
        (window.isReversed.value
            ? props.reverseTransition !== false
            : props.transition !== false),
);

/**
 * ## onAfterTransition
 */
function onAfterTransition() {
    if (!isTransitioning.value || !window) {
        return;
    }
    // Finalize transition state.
    isTransitioning.value = false;
    if (window.transitionCount.value > 0) {
        window.transitionCount.value -= 1;

        // Remove container height if we are out of transition.
        if (window.transitionCount.value === 0) {
            window.transitionHeight.value = undefined;
        }
    }
}

/**
 * ## onBeforeTransition
 */
function onBeforeTransition() {
    if (isTransitioning.value || !window) {
        return;
    }
    // Initialize transition state here.
    isTransitioning.value = true;
    if (window.transitionCount.value === 0) {
        // Set initial height for height transition.
        window.transitionHeight.value = toWebUnit(
            window.rootRef.value?.clientHeight,
        );
    }
    window.transitionCount.value += 1;
}

/**
 * ## onTransitionCancelled
 */
function onTransitionCancelled() {
    onAfterTransition(); // This should have the same path as normal transition end.
}

/**
 * ## onEnterTransition
 * @param el
 */
function onEnterTransition(el: Element) {
    if (!isTransitioning.value) {
        return;
    }

    nextTick(() => {
        // Do not set height if no transition or cancelled.
        if (!hasTransition.value || !isTransitioning.value || !window) {
            return;
        }
        // Set transition target height.
        window.transitionHeight.value = toWebUnit(el.clientHeight);
    });
}

const transition = computed(() => {
    const name = window.isReversed.value
        ? props.reverseTransition
        : props.transition;

    return !hasTransition.value
        ? false
        : {
              name: !isString(name) ? window.transition.value : name,
              onBeforeEnter: onBeforeTransition,
              onAfterEnter: onAfterTransition,
              onEnterCancelled: onTransitionCancelled,
              onBeforeLeave: onBeforeTransition,
              onAfterLeave: onAfterTransition,
              onLeaveCancelled: onTransitionCancelled,
              onEnter: onEnterTransition,
          };
});

const { hasContent } = useLazy(props, groupItem.isSelected);
</script>

<template>
    <ev-transition :transition="transition" :disabled="!isBooted">
        <div
            v-show="groupItem.isSelected.value"
            :class="['ev-window-item', props.class]"
            :style="props.style">
            <slot v-if="hasContent" />
        </div>
    </ev-transition>
</template>
