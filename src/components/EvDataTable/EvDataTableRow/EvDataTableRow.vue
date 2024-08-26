<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow.ts";

const props = defineProps({ ...makeEvDataTableRowProps() });
const slots = defineSlots<{
    default(): never;
}>();
</script>

<template>
    <tr :class="['ev-data-table-row']">
        <slot name="default" />
    </tr>
</template>
