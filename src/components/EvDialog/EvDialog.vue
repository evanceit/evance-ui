<script setup lang="ts">
/**
 * `<ev-dialog>`
 */
import './EvDialog.scss';
import {DialogSize, DialogSizeToWidth, makeEvDialogProps} from "./EvDialog.ts";
import {computed, mergeProps, nextTick, ref, useSlots, watch} from "vue";
import EvOverlay from "@/components/EvOverlay/EvOverlay.vue";
import EvSurface from "@/components/EvSurface/EvSurface.vue";
import {Browser, filterComponentProps, getFocusableChildren} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";
import EvDialogBody from "@/components/EvDialog/EvDialogBody.vue";
import EvDialogFooter from "@/components/EvDialog/EvDialogFooter.vue";
import EvDialogHeader from "@/components/EvDialog/EvDialogHeader.vue";

const props = defineProps(makeEvDialogProps());
const slots = useSlots();
const overlayRef = ref();
const isActive = useModelProxy(props, 'modelValue');
const isFullscreen = useModelProxy(props, 'fullscreen');
const overlayProps = computed(() => {
    return filterComponentProps(EvOverlay, props);
});

const activatorProps = computed(() => {
    mergeProps({
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isActive.value)
    }, props.activatorProps);
});

/**
 * ## Width
 *
 * We want to standardise dialog sizes. So we can intercept the `width` prop.
 *
 * - 'small'
 * - 'medium'
 * - 'large'
 * - 'x-large'
 */
const width = computed(() => {
    let size = props.width ?? DialogSizeToWidth[DialogSize.medium];
    return DialogSizeToWidth[size] ?? size;
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

/**
 * If the browser window is available (not SSR)
 * then we need to add the focusin event listen when the dialog is open
 * and then remove the event listener when it is closed.
 */
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
 * ## Close
 */
function close() {
    isActive.value = false;
}

</script>
<template>
    <ev-overlay
        ref="overlayRef"
        aria-modal="true"
        role="dialog"
        :class="[
            'ev-dialog',
            {
                'is-fullscreen': isFullscreen,
                'is-scrollable': props.scrollable
            },
            props.class
        ]"
        :style="props.style"
        v-bind="overlayProps"
        :activatorProps="activatorProps"
        :width="width"
        v-model="isActive"
    >
        <template v-if="slots.activator" #activator="{isActive, props}">
            <slot name="activator" :isActive="isActive" :props="props" />
        </template>

        <slot v-if="slots.container" name="container" />
        <ev-surface
            v-else
            class="ev-dialog--surface"
            elevation="overlay"
            rounded="small"
        >
            <ev-dialog-header
                v-if="props.showHeader"
                v-model="isActive">
                <slot name="header" />
            </ev-dialog-header>
            <ev-dialog-body>
                <slot />
            </ev-dialog-body>
            <ev-dialog-footer v-if="slots.footer">
                <slot name="footer" />
            </ev-dialog-footer>
        </ev-surface>

    </ev-overlay>
</template>