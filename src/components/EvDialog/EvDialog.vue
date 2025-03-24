<script setup lang="ts">
/**
 * `<ev-dialog>`
 */
import "./EvDialog.scss";
import { DialogSize, DialogSizeToWidth, makeEvDialogProps } from "./EvDialog";
import {
    computed,
    mergeProps,
    nextTick,
    onBeforeUnmount,
    ref,
    watch,
} from "vue";
import { EvOverlay } from "@/components/EvOverlay";
import EvSurface from "@/components/EvSurface/EvSurface.vue";
import {
    Browser,
    filterComponentProps,
    getFocusableChildren,
    getOuterHeight,
    getOuterWidth,
    getViewport,
} from "@/util";
import { useModelProxy } from "@/composables/modelProxy";
import EvDialogBody from "@/components/EvDialog/EvDialogBody.vue";
import EvDialogFooter from "@/components/EvDialog/EvDialogFooter.vue";
import EvDialogHeader from "@/components/EvDialog/EvDialogHeader.vue";
import { provideDialog } from "@/composables/dialog";

const props = defineProps({
    ...makeEvDialogProps(),
});
const slots = defineSlots<{
    activator(): never;
    container(): never;
    default(): never;
    footer(): never;
    header(): never;
}>();
const overlayRef = ref();
const isActive = useModelProxy(props, "modelValue");
const isFullscreen = useModelProxy(props, "fullscreen");
const overlayProps = computed(() => {
    return filterComponentProps(EvOverlay, props);
});

const activatorProps = computed(() => {
    return mergeProps(
        {
            "aria-haspopup": "dialog",
            "aria-expanded": String(isActive.value),
        },
        props.activatorProps,
    );
});

const headerProps = computed(() => {
    const separatedProps = {
        actions: props.headerActions,
        closeable: props.closeable,
        icon: props.icon,
        title: props.title,
    };
    const suppliedProps = props.headerProps ?? {};
    return Object.assign(separatedProps, suppliedProps);
});

const bodyProps = computed(() => {
    const separatedProps = {
        padding: !props.noPadding,
    };
    const suppliedProps = props.bodyProps ?? {};
    return Object.assign(separatedProps, suppliedProps);
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update:fullscreen", value: boolean): void;
    (e: "dragstart", value: MouseEvent): void;
    (e: "dragend", value: MouseEvent): void;
    (e: "open"): void;
    (e: "after-open"): void;
    (e: "close"): void;
    (e: "after-close"): void;
}>();

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
    const size = props.width ?? DialogSizeToWidth[DialogSize.medium];
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
        previousEl !== targetEl &&
        overlayRef.value?.contentEl &&
        overlayRef.value?.isTopGlobal &&
        ![document, overlayRef.value.contentEl].includes(targetEl) &&
        !overlayRef.value.contentEl.contains(targetEl)
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
                document.addEventListener("focusin", onFocusin);
            } else {
                document.removeEventListener("focusin", onFocusin);
            }
        },
        {
            immediate: true,
        },
    );
}

/**
 * Watch for changes to the `modelValue` when the dialog is opened
 * focus on the content element. When it is closed revert focus
 * to the activator element if it is available.
 */
watch(isActive, async (value) => {
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

provideDialog(props.__instance);

defineExpose({
    close,
});

/**
 * Dragging
 * @todo: Still implementing draggable dialogs
 **/
let dragging = false;
let lastPageX = null;
let lastPageY = null;
let documentDragListener = null;
let documentDragEndListener = null;

function initDrag(e: MouseEvent) {
    if (
        !props.draggable ||
        (e.target instanceof Element && e.target.closest("[data-no-drag]"))
    ) {
        return;
    }
    dragging = true;
    lastPageX = e.pageX;
    lastPageY = e.pageY;
    document.body.style.userSelect = "none";
    emit("dragstart", e);
}

function onEnter() {
    emit("open");
    bindGlobalListeners();
}
function onAfterEnter() {
    emit("after-open");
}
function onBeforeLeave() {
    if (dragging && documentDragEndListener) {
        documentDragEndListener();
    }
}
function onLeave() {
    emit("close");
}
function onAfterLeave() {
    unbindGlobalListeners();
    emit("after-close");
}

function bindGlobalListeners() {
    if (props.draggable) {
        bindDocumentDragListener();
        bindDocumentDragEndListener();
    }
}

function bindDocumentDragListener() {
    documentDragListener = (event) => {
        const container = overlayRef.value?.contentEl;
        if (dragging && container) {
            const width = getOuterWidth(container);
            const height = getOuterHeight(container);
            const deltaX = event.pageX - lastPageX;
            const deltaY = event.pageY - lastPageY;
            const offset = container.getBoundingClientRect();
            const leftPos = offset.left + deltaX;
            const topPos = offset.top + deltaY;
            const viewport = getViewport();
            const containerComputedStyle = getComputedStyle(container);
            const marginLeft = parseFloat(containerComputedStyle.marginLeft);
            const marginTop = parseFloat(containerComputedStyle.marginTop);
            container.style.position = "fixed";

            if (props.dragWithinViewport) {
                if (
                    leftPos >= props.dragMinX &&
                    leftPos + width < viewport.width
                ) {
                    lastPageX = event.pageX;
                    container.style.left = leftPos - marginLeft + "px";
                }

                if (
                    topPos >= props.dragMinY &&
                    topPos + height < viewport.height
                ) {
                    lastPageY = event.pageY;
                    container.style.top = topPos - marginTop + "px";
                }
            } else {
                lastPageX = event.pageX;
                container.style.left = leftPos - marginLeft + "px";
                lastPageY = event.pageY;
                container.style.top = topPos - marginTop + "px";
            }
        }
    };
    window.document.addEventListener("mousemove", documentDragListener);
}

function bindDocumentDragEndListener() {
    documentDragEndListener = (event: MouseEvent) => {
        if (dragging) {
            dragging = false;
            document.body.style.userSelect = "";
            emit("dragend", event);
        }
    };
    window.document.addEventListener("mouseup", documentDragEndListener);
}

function unbindGlobalListeners() {
    unbindDocumentDragListener();
    unbindDocumentDragEndListener();
}

function unbindDocumentDragListener() {
    if (documentDragListener) {
        window.document.removeEventListener("mousemove", documentDragListener);
        documentDragListener = null;
    }
}

function unbindDocumentDragEndListener() {
    if (documentDragEndListener) {
        window.document.removeEventListener("mouseup", documentDragEndListener);
        documentDragEndListener = null;
    }
}

onBeforeUnmount(() => {
    unbindGlobalListeners();
});

</script>

<template>
    <ev-overlay
        ref="overlayRef"
        v-bind="overlayProps"
        v-model="isActive"
        aria-modal="true"
        role="dialog"
        :class="[
            'ev-dialog',
            {
                'is-fullscreen': isFullscreen,
                'is-scrollable': props.scrollable,
            },
            props.class,
        ]"
        :style="props.style"
        :activator-props="activatorProps"
        :width="width"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave">
        <template v-if="slots.activator" #activator="{ isActive, props }">
            <slot name="activator" :is-active="isActive" :props="props" />
        </template>

        <slot v-if="slots.container" name="container" />
        <ev-surface
            v-else
            class="ev-dialog--surface"
            elevation="overlay"
            rounded="small">
            <ev-dialog-header
                v-if="!props.hideHeader"
                v-model="isActive"
                v-bind="headerProps"
                @mousedown="initDrag">
                <template v-if="slots.header" #default>
                    <slot name="header" />
                </template>
            </ev-dialog-header>
            <ev-dialog-body v-bind="bodyProps">
                <slot />
            </ev-dialog-body>
            <ev-dialog-footer v-if="slots.footer">
                <slot name="footer" />
            </ev-dialog-footer>
        </ev-surface>
    </ev-overlay>
</template>
