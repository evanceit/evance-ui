<script setup lang="ts">
/**
 * # EvMenu
 */
import "./EvMenu.scss";
import { makeEvMenuProps } from "./EvMenu.ts";
import { EvOverlay } from "@/components/EvOverlay";
import {
    computed,
    inject,
    mergeProps,
    provide,
    ref,
    shallowRef,
    watch,
} from "vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { filterComponentProps, focusChild, getNextId } from "@/util";
import { EvMenuSymbol } from "./shared.ts";

const props = defineProps({
    ...makeEvMenuProps(),
});
const slots = defineSlots<{
    activator(props: { isActive: boolean; props: any }): never;
    default(): never;
}>();
const isActive = useModelProxy(props, "modelValue");
const uid = getNextId();
const id = computed(() => {
    return props.id || `ev-menu-${uid}`;
});
const overlay = ref<typeof EvOverlay>();
const parent = inject(EvMenuSymbol, null);
const openChildren = shallowRef(0);

provide(EvMenuSymbol, {
    register() {
        ++openChildren.value;
    },
    unregister() {
        --openChildren.value;
    },
    closeParents() {
        setTimeout(() => {
            if (!openChildren.value) {
                isActive.value = false;
                parent?.closeParents();
            }
        }, 40);
    },
});

watch(isActive, (value) => {
    return value ? parent?.register() : parent?.unregister();
});

function onClickOutside() {
    parent?.closeParents();
}

function onKeydown(e: KeyboardEvent) {
    if (props.disabled) {
        return;
    }
    if (e.key === "Tab") {
        isActive.value = false;
        overlay.value?.activatorEl?.focus();
    }
}

/**
 * ## On Activator Keydown
 *
 * @param e
 */
function onActivatorKeydown(e: KeyboardEvent) {
    if (props.disabled) {
        return;
    }
    const el = overlay.value?.contentEl;
    if (el && isActive.value) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            focusChild(el, "next");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusChild(el, "previous");
        }
    } else if (["ArrowDown", "ArrowUp"].includes(e.key)) {
        isActive.value = true;
        e.preventDefault();
        setTimeout(() => setTimeout(() => onActivatorKeydown(e)));
    }
}

/**
 * ## Activator Props
 *
 * Manipulate the activator props to include the keydown event listener
 * and ARIA attributes for accessibility.
 */
const activatorProps = computed(() => {
    return mergeProps(
        {
            "aria-haspopup": "menu",
            "aria-expanded": String(isActive.value),
            "aria-owns": id.value,
            onKeydown: onActivatorKeydown,
        },
        props.activatorProps,
    );
});

/**
 * ## Expose aspects of EvMenu to parent components
 */
defineExpose({
    id,
    openChildren,
});

const overlayProps = computed(() => filterComponentProps(EvOverlay, props));
</script>

<template>
    <ev-overlay
        ref="overlay"
        v-model="isActive"
        v-bind="overlayProps"
        :class="['ev-menu', props.class]"
        :style="props.style"
        :activator-props="activatorProps"
        @click:outside="onClickOutside"
        @keydown="onKeydown">
        <template v-if="slots.activator" #activator="{ isActive, props }">
            <slot name="activator" :is-active="isActive" :props="props" />
        </template>
        <template #default>
            <slot name="default" />
        </template>
    </ev-overlay>
</template>
