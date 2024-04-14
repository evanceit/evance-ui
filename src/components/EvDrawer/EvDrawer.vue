<script setup lang="ts">
import './EvDrawer.scss';
import {EvDialog} from "@/components/EvDialog";
import {makeEvDrawerProps} from "@/components/EvDrawer/EvDrawer.ts";
import {computed, ref} from "vue";
import {filterComponentProps, omit} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";

const props = defineProps(makeEvDrawerProps());
const dialogProps = computed(() => {
    return omit(
        filterComponentProps(EvDialog, props),
        ['position']
    )
});
const isActive = useModelProxy(props, 'modelValue');
const dialogRef = ref(null);

const positionClass = computed(() => {
    return `is-position-${props.position}`;
});

const transition = computed(() =>  {
    return `ev-drawer--transition-${props.position}`;
});

const overlayWidth = computed(() => {
    if (props.position === 'top' || props.position === 'bottom') {
        return '100%';
    }
    return props.width ?? 'medium';
});

</script>
<template>
    <ev-dialog
        ref="dialogRef"
        v-bind="dialogProps"
        v-model="isActive"
        :class="[
            'ev-drawer',
            positionClass,
            props.class
        ]"
        :style="props.style"
        :transition="transition"
        :width="overlayWidth"
    >
        <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
            <component :is="slot" v-bind="slotProps" />
        </template>
    </ev-dialog>
</template>