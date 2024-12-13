<script setup lang="ts">
import "./EvDataTableRow.scss";
import { makeEvDataTableRowProps } from "./EvDataTableRow.ts";
import { computed } from "vue";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";
import { EvCheckbox } from "@/components/EvCheckbox";
import { useSelection } from "@/components/EvDataTable/composables/select.ts";
import { useHeaders } from "@/components/EvDataTable/composables/headers.ts";
import { ItemSlot } from "@/components/EvDataTable/composables/types.ts";
import { getPropertyValue } from "@/util";

const props = defineProps({ ...makeEvDataTableRowProps() });
const slots = defineSlots<{
    default(props: ItemSlot): never;
}>();

const isClickable = computed(() => {
    return props.onClick || props.onContextmenu || props.onDblclick;
});

const { selected, isSelected, toggleSelect, showSelect } = useSelection();
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
        <ev-data-table-cell
            v-if="showSelect"
            class="ev-data-table-row--checkbox">
            <ev-checkbox
                :model-value="isItemSelected"
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
                <ev-data-table-cell :align="column.align">
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
