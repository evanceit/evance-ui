<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow";
import {computed, toRaw} from "vue";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";
import { EvCheckbox } from "@/components/EvCheckbox";
import { useSelection } from "@/components/EvDataTable/composables/select";
import { useHeaders } from "@/components/EvDataTable/composables/headers";
import { ItemSlot } from "@/components/EvDataTable/composables/types";
import { getPropertyValue } from "@/util";

const props = defineProps({ ...makeEvDataTableRowProps() });
const slots = defineSlots<{
    default(props: ItemSlot): never;
}>();

const { isSelected, toggleSelect, showSelect, selectStrategy } = useSelection();
// const { isExpanded, toggleExpand } = useExpanded();
const { columns } = useHeaders();
const item = props.item;
const isItemSelected = computed(() => isSelected(item));
const isItemSelectable = computed(() => {
    return (
        (props.selectable || item.selectable) && selectStrategy.value.selectable
    );
});

const isClickable = computed(() => {
    return (
        props.onClick ||
        props.onContextmenu ||
        props.onDblclick ||
        (!showSelect.value && isItemSelectable.value)
    );
});

function onCheckboxClick(e: MouseEvent) {
    toggleSelect(item, e.shiftKey);
}

function onClick(e: MouseEvent) {
    if (!showSelect.value && isItemSelectable.value) {
        toggleSelect(item, e.shiftKey);
    }
    props.onClick?.(e);
}

function onMouseDown(e: MouseEvent) {
    if (e.shiftKey) {
        document.body.style.userSelect = "none";
    }
}

function onMouseUp(e: MouseEvent) {
    if (e.shiftKey) {
        document.body.style.userSelect = "";
    }
}

defineExpose({
    index: props.index,
    columns,
    item: toRaw(item.raw),
    internalItem: toRaw(item),
    isSelected,
    toggleSelect,
});
</script>

<template>
    <tr
        :class="[
            'ev-data-table-row',
            {
                'is-clickable': isClickable,
                'is-selected': isItemSelected,
                'is-indicated': !showSelect && selectStrategy.selectable,
            },
        ]"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @click="onClick"
        @contextmenu="props.onContextmenu"
        @dblclick="props.onDblclick">
        <ev-data-table-cell
            v-if="showSelect"
            class="ev-data-table-cell--checkbox">
            <ev-checkbox
                :model-value="isItemSelected"
                :disabled="!isItemSelectable"
                @click.stop="onCheckboxClick" />
        </ev-data-table-cell>

        <slot
            name="default"
            v-bind="{
                index,
                columns,
                item: item.raw,
                internalItem: item,
                isSelected,
                toggleSelect,
            }">
            <template
                v-for="column in columns"
                :key="`item-${index}-${column.key}`">
                <ev-data-table-cell
                    v-bind="column.cellProps"
                    :align="column.align">
                    <slot
                        :name="`item.${column.key}`"
                        v-bind="{
                            index,
                            item: item.raw,
                            internalItem: item,
                            value: getPropertyValue(item.columns, column.key),
                            column: column,
                            isSelected,
                            toggleSelect,
                        }">
                        {{ getPropertyValue(item.columns, column.key) }}
                    </slot>
                </ev-data-table-cell>
            </template>
        </slot>
    </tr>
</template>
