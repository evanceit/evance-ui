<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
}>();
</script>

<template>
    <table :class="['ev-data-table']">
        <slot name="default" />
    </table>
</template>
