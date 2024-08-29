<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow.ts";
import { computed } from "vue";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";
import { EvCheckbox } from "@/components/EvCheckbox";

const props = defineProps({ ...makeEvDataTableRowProps() });
const slots = defineSlots<{
    default(): never;
}>();

const isClickable = computed(() => {
    return props.onClick || props.onContextmenu || props.onDblclick;
});

const item = props.item;
</script>

<template>
    <tr
        :class="['ev-data-table-row', { 'is-clickable': isClickable }]"
        @click="props.onClick"
        @contextmenu="props.onContextmenu"
        @dblclick="props.onClick">

        <ev-data-table-cell v-if="props.selectable">
            <ev-checkbox />
        </ev-data-table-cell>

        <slot name="default" />
    </tr>
</template>
