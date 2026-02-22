<script setup lang="ts">
import "./EvExpansionPanels.scss"
import { makeEvExpansionPanelsProps } from "./EvExpansionPanels";
import { useGroup } from "@/composables/group";
import { EvExpansionPanelSymbol } from "@/components/EvExpansionPanel";
import { computed } from "vue";

const props = defineProps({
    ...makeEvExpansionPanelsProps()
});

const slots = defineSlots<{
    default(): never;
}>();

const { next, previous, selectAll, selected } = useGroup(
    props,
    EvExpansionPanelSymbol,
);

const hasExpanded = computed(() => selected.value.length > 0);

defineExpose({
    next,
    previous,
    hasExpanded,
    expandAll: () => selectAll(true),
    collapseAll: () => selectAll(false),
});

const variantClass = computed(() => `is-variant-${props.variant}`);
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-expansion-panels', variantClass, props.class]">
        <slot name="default" v-bind="{ next, previous }" />
    </component>
</template>
