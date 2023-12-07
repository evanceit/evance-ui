<script setup lang="ts">
/**
 * `<ev-dialog>`
 */
import './EvDialog.scss';
import {makeEvDialogProps} from "./EvDialog.ts";
import {computed, mergeProps, nextTick, ref, useSlots, watch} from "vue";
import EvOverlay from "@/components/EvOverlay/EvOverlay.vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import EvSurface from "@/components/EvSurface/EvSurface.vue";
import {Browser, filterComponentProps, getFocusableChildren, is} from "@/util";
import {Cancel} from "@/icons";
import {useModelProxy} from "@/composables/modelProxy.ts";

const props = defineProps(makeEvDialogProps());
const slots = useSlots();
const overlayRef = ref();
const isActive = useModelProxy(props, 'modelValue');

const overlayProps = filterComponentProps(EvOverlay, props);

const activatorProps = computed(() => {
    mergeProps({
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isActive.value)
    }, props.activatorProps);
});


/**
 * ## onFocusin
 *
 * When the user opens the dialog and presses tab (for example)
 * we can apply focus to the first available and focusable element.
 *
 * 1. The dialog MUST be the top-most open dialog.
 * 2. The target element MUST be the document nor the content of the dialog.
 * 3. The target element isn't within the dialog content.
 *
 * If the conditions above are met then we can refocus the user into the
 * first/last available focusable element.
 *
 * @param e
 */
function onFocusin(e: FocusEvent) {
    const previousEl = e.relatedTarget as HTMLElement | null;
    const targetEl = e.target as HTMLElement | null;

    if (
        previousEl !== targetEl
        && overlayRef.value?.contentEl
        && overlayRef.value?.isTopGlobal
        && ![document, overlayRef.value.contentEl].includes(targetEl)
        && !overlayRef.value.contentEl.contains(targetEl)
    ) {
        const focusable = getFocusableChildren(overlayRef.value.contentEl);
        if (!focusable.length) {
            return;
        }
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];
        if (previousEl === firstEl) {
            lastEl.focus();
        } else {
            firstEl.focus();
        }
    }
}

if (Browser.hasWindow) {
    watch(
        () => isActive.value && props.retainFocus,
        (value) => {
            if (value) {
                document.addEventListener('focusin', onFocusin);
            } else {
                document.removeEventListener('focusin', onFocusin);
            }
        },
        {
            immediate: true
        }
    );
}

/**
 * Watch for changes to the `modelValue` when the dialog is opened
 * focus on the content element. When it is closed revert focus
 * to the activator element if it is available.
 */
watch(isActive, async value => {
    await nextTick();
    if (value) {
        overlayRef.value!.contentEl?.focus({ preventScroll: true });
    } else {
        overlayRef.value!.activatorEl?.focus({ preventScroll: true });
    }
});

/**
 * @todo: we can remove this when we're done.
 */
function onClick() {
    isActive.value = !isActive.value;
}

</script>
<template>
    <ev-button @click="onClick">Hello</ev-button>
    <ev-overlay
        ref="overlayRef"
        aria-modal="true"
        :class="[
            'ev-dialog',
            props.class
        ]"
        :style="props.style"
        v-bind="overlayProps"
        :activatorProps="activatorProps"
        v-model="isActive"
    >
        <ev-surface elevation="overlay" rounded="small">
            <div style="padding: 2rem">
                This is where the content goes.

                <ev-button rounded appearance="subtle" :icon="Cancel" />

            </div>
        </ev-surface>
    </ev-overlay>
</template>