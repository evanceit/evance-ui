<script setup lang="ts">
/**
 * # EvMenu
 */
import {makeEvMenuProps} from "../EvMenu";
import {computed, inject, mergeProps, provide, ref, shallowRef, useSlots, watch} from "vue";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {useScopeId} from "../../composables/scopeId.ts";
import {focusChild, getNextId} from "../../util";
import {EvOverlay} from "../EvOverlay";
import {EvMenuSymbol} from "./shared.ts";

const props = defineProps(makeEvMenuProps());
const slots = useSlots();
const isActive = useModelProxy(props, 'modelValue');
const { scopeId } = useScopeId();
const uid = getNextId();
const id = computed(() => {
    return props.id || `ev-menu-${uid}`;
});
const overlay = ref<EvOverlay>();
const parent = inject(EvMenuSymbol, null);
const openChildren = shallowRef(0);

provide(EvMenuSymbol, {
    register () {
        ++openChildren.value;
    },
    unregister () {
        --openChildren.value;
    },
    closeParents () {
        setTimeout(() => {
            if (!openChildren.value) {
                isActive.value = false;
                parent?.closeParents();
            }
        }, 40);
    }
});

watch(isActive, (values) => {
   return value ? parent?.register() : parent?.unregister();
});

function onClickOutside() {
    parent?.closeParents();
}

function onKeydown(e: KeyboardEvent) {
    if (props.disabled) {
        return;
    }
    if (e.key === 'Tab') {
        isActive.value = false;
        overlay.value?.activatorEl?.focus();
    }
}

function onActivatorKeydown(e: KeyboardEvent) {
    if (props.disabled) {
        return;
    }
    const el = overlay.value?.contentEl;
    if (el && isActive.value) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusChild(el, 'next');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusChild(el, 'prev');
        }
    } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        isActive.value = true;
        e.preventDefault();
        setTimeout(() => setTimeout(() => onActivatorKeydown(e)));
    }
}

const activatorProps = computed(() => {
    mergeProps({
        'aria-haspopup': 'menu',
        'aria-expanded': String(isActive.value),
        'aria-owns': id.value,
        onKeydown: onActivatorKeydown
    }, props.activatorProps);
});



</script>
<template>
    <ev-overlay
        ref="overlay"
        class="ev-menu"
        :class="[
            props.class
        ]"
        :style="[
            props.style
        ]"
        :activator-props="activatorProps"
        v-model="isActive"
        @click:outside="onClickOutside"

    >

    </ev-overlay>
</template>