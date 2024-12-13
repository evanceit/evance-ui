<script setup lang="ts">
import "./EvDataTableCell.scss";
import { makeEvDataTableCellProps } from "./EvDataTableCell.ts";
import { computed } from "vue";
import { useDimensions } from "@/composables/dimensions.ts";

const props = defineProps({ ...makeEvDataTableCellProps() });
const slots = defineSlots<{
    default(): never;
}>();

const alignClass = computed(() => {
    return props.align ? `text-${props.align}` : undefined;
});

const dimensions = useDimensions(props);
</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-data-table-cell',
            { 'pa-0': props.noPadding },
            alignClass,
            props.class,
        ]"
        :colspan="props.colspan"
        :style="[dimensions, props.style]">
        <slot name="default" />
    </component>
</template>
