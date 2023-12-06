<script setup lang="ts">
/**
 * `<ev-dialog>`
 */
import './EvDialog.scss';
import EvOverlay from "@/components/EvOverlay/EvOverlay.vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import {computed, mergeProps, ref, shallowRef, useSlots} from "vue";
import {makeEvDialogProps} from "@/components";
import EvSurface from "@/components/EvSurface/EvSurface.vue";
import {filterComponentProps} from "@/util";

const props = defineProps(makeEvDialogProps());
const slots = useSlots();
const overlayRef = ref();
const isActive = shallowRef(false);

const overlayProps = filterComponentProps(EvOverlay, props);

function onClick() {
    isActive.value = !isActive.value;
    console.log(overlayProps);
}

const activatorProps = computed(() => {
    mergeProps({
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isActive.value)
    }, props.activatorProps);
});

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
            </div>
        </ev-surface>
    </ev-overlay>
</template>