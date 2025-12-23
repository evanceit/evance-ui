<script setup lang="ts">
import "./EvTooltip.scss";
import { makeEvTooltipProps } from "./EvTooltip";
import { useModelProxy } from "@/composables/modelProxy";
import { filterComponentProps, getNextId } from "@/util";
import { EvOverlay, PositionStrategyProps } from "@/components/EvOverlay";
import { computed, mergeProps, ref } from "vue";

const props = defineProps({
    ...makeEvTooltipProps(),
});

const slots = defineSlots<{
    activator(): never;
    default(): never;
}>();

const isActive = useModelProxy(props, "modelValue");
const uid = getNextId();

const id = computed(() => {
    return props.id || `ev-tooltip-${uid}`;
});

const overlayRef = ref<typeof EvOverlay>();
const overlayProps = computed(() => filterComponentProps(EvOverlay, props));

const position = computed(() => {
    return props.position.split(" ").length > 1
        ? props.position
        : ((props.position + " center") as PositionStrategyProps["position"]);
});

const origin = computed(() => {
    return props.origin === "auto" ||
        props.origin === "overlap" ||
        props.origin.split(" ").length > 1 ||
        props.position.split(" ").length > 1
        ? props.origin
        : ((props.origin + " center") as PositionStrategyProps["origin"]);
});

const transition = computed(() => {
    if (props.transition) {
        return props.transition;
    }
    return isActive.value ? "transition-scale" : "transition-fade";
});

const activatorProps = computed(() => {
    return mergeProps(
        {
            "aria-describedby": id.value,
        },
        props.activatorProps,
    );
});
</script>

<template>
    <ev-overlay
        :id="id"
        ref="overlayRef"
        v-bind="overlayProps"
        v-model="isActive"
        role="tooltip"
        :class="['ev-tooltip', props.class]"
        :style="props.style"
        :transition="transition"
        :position="position"
        :origin="origin"
        :activator-props="activatorProps"
        absolute
        disable-global-stack>
        <template v-if="slots.activator" #activator="activatorSlotProps">
            <slot name="activator" v-bind="activatorSlotProps" />
        </template>
        <template #pointer>
            <div class="ev-tooltip--pointer"></div>
        </template>
        <slot name="default">{{ props.text }}</slot>
    </ev-overlay>
</template>
