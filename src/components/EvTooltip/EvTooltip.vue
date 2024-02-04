<script setup lang="ts">
import './EvTooltip.scss';
import {makeEvTooltipProps} from "./EvTooltip.ts";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {filterComponentProps, getNextId} from "@/util";
import {EvOverlay, PositionStrategyProps} from "@/components/EvOverlay";
import {computed, mergeProps, ref} from "vue";
import {useScopeId} from "@/composables/scopeId.ts";


const props = defineProps(makeEvTooltipProps());

const isActive = useModelProxy(props, 'modelValue');
const { scopeId } = useScopeId();
const uid = getNextId();

const id = computed(() => {
    return props.id || `ev-tooltip-${uid}`;
});

const overlayRef = ref<typeof EvOverlay>();
const overlayProps = filterComponentProps(EvOverlay, props);

const position = computed(() => {
    return props.position.split(' ').length > 1
        ? props.position
        : props.position + ' center' as PositionStrategyProps['position'];
});

const origin = computed(() => {
    return (
        props.origin === 'auto' ||
        props.origin === 'overlap' ||
        props.origin.split(' ').length > 1 ||
        props.position.split(' ').length > 1
    )
        ? props.origin
        : props.origin + ' center' as PositionStrategyProps['origin'];
});

const transition = computed(() => {
    if (props.transition) {
        return props.transition;
    }
    return isActive.value ? 'transition-scale' : 'transition-fade';
});

const activatorProps = computed(() => {
    return mergeProps({
        'aria-describedby': id.value,
    }, props.activatorProps);
});

</script>
<template>
    <ev-overlay
        ref="overlayRef"
        role="tooltip"
        :class="[
            'ev-tooltip',
            props.class
        ]"
        :style="props.style"
        :id="id"
        v-bind="overlayProps"
        v-model="isActive"
        :transition="transition"
        :position="position"
        :origin="origin"
        :activator-props="activatorProps"
        absolute
        disable-global-stack
    >
        <slot>{{ props.text }}</slot>
    </ev-overlay>
</template>