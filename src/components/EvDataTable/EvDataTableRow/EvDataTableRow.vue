<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow.ts";
import {computed} from "vue";
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

const { selected, isSelected, toggleSelect } = useSelection();
// const { isExpanded, toggleExpand } = useExpanded();
const { columns } = useHeaders();

const item = props.item;

const isItemSelected = computed(() => isSelected(item));

function onCheckboxClick(e: PointerEvent) {
    toggleSelect(item, e.shiftKey);
}
</script>

<template>
    <tr
        :class="[
            'ev-data-table-row',
            {
                'is-clickable': isClickable,
                'is-selected': isItemSelected,
            },
        ]"
        @click="props.onClick"
        @contextmenu="props.onContextmenu"
        @dblclick="props.onClick">
        <ev-data-table-cell class="ev-data-table-row--checkbox">
            <ev-checkbox
                :model-value="isItemSelected"
                @click.stop="onCheckboxClick" />
        </ev-data-table-cell>

        <slot name="default" v-bind="{ item }">
            <ev-data-table-cell
                v-for="column in columns"
                :key="`item-${index}-${column.key}`">
                {{ item.raw[column.key] }}
            </ev-data-table-cell>
        </slot>
    </tr>
</template>
