<script setup lang="ts">
import "./EvExpansionPanels.scss"
import { makeEvExpansionPanelsProps } from "./EvExpansionPanels";
import { useGroup } from "@/composables/group";
import { EvExpansionPanelSymbol } from "@/components/EvExpansionPanel";

const props = defineProps({
    ...makeEvExpansionPanelsProps()
});

const slots = defineSlots<{
    default(): never;
}>();

const { next, previous } = useGroup(props, EvExpansionPanelSymbol)

defineExpose({
    next,
    previous,
});

</script>

<template>
    <component :is="props.tag"
               :class="['ev-expansion-panels', props.class]">
        <slot name="default" v-bind="{ next, previous }" />
    </component>
</template>
