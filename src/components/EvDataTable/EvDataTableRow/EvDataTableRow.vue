<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow.ts";
import { computed } from "vue";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";
import { EvCheckbox } from "@/components/EvCheckbox";
import { useSelection } from "@/components/EvDataTable/composables/select.ts";
import { useExpanded } from "@/components/EvDataTable/composables/expand.ts";
import { useHeaders } from "@/components/EvDataTable/composables/headers.ts";

const props = defineProps({ ...makeEvDataTableRowProps() });
const slots = defineSlots<{
    default(): never;
}>();

const isClickable = computed(() => {
    return props.onClick || props.onContextmenu || props.onDblclick;
});

const { isSelected, toggleSelect } = useSelection();
// const { isExpanded, toggleExpand } = useExpanded();
const { columns } = useHeaders();

const item = props.item;


</script>

<template>

    <tr
        :class="['ev-data-table-row', { 'is-clickable': isClickable }]"
        @click="props.onClick"
        @contextmenu="props.onContextmenu"
        @dblclick="props.onClick">

        <ev-data-table-cell>
            <ev-checkbox @click.stop="toggleSelect(item)" />
        </ev-data-table-cell>

        <slot name="default" v-bind="{ item }">
            <ev-data-table-cell v-for="column in columns" :key="`item-${index}-${column.key}`">
                {{ item }}
            </ev-data-table-cell>
        </slot>
    </tr>
</template>
