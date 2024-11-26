<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, toRef } from "vue";
import { useVirtual } from "@/composables/virtual.ts";
import { toWebUnit } from "@/util";
import { useDataTableItems } from "./composables/items.ts";
import EvVirtualScrollItem from "@/components/EvVirtualScroll/EvVirtualScrollItem.vue";
import {createGroupBy, provideGroupBy} from "@/components/EvDataTable/composables/group.ts";
import { createHeaders } from "@/components/EvDataTable/composables/headers.ts";
import { EvDataTableRow } from "@/components/EvDataTable/EvDataTableRow";
import { provideSelection } from "@/components/EvDataTable/composables/select.ts";
import {EvDataTableSearch} from "@/components/EvDataTable/EvDataTableSearch";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
    colgroup(): never;
}>();

const dimensions = useDimensions(props);
const { groupBy } = createGroupBy(props);
const { columns, headers, sortFunctions, filterFunctions } = createHeaders(props, {
    groupBy,
    showSelect: toRef(props, "showSelect"),
    showExpand: toRef(props, "showExpand"),
});

const { items } = useDataTableItems(props, columns);

// const { sortByWithGroups, opened, extractRows, isGroupOpen, toggleGroup } = provideGroupBy({ groupBy, sortBy });
// const paginatedItemsWithoutGroups = computed(() => extractRows(paginatedItems.value))
const paginatedItemsWithoutGroups = computed(() => items.value);

const {
    selected,
    isSelected,
    select,
    selectAll,
    toggleSelect,
    someSelected,
    allSelected,
} = provideSelection(props, { allItems: items, currentPage: paginatedItemsWithoutGroups });

const flatItems = computed(() => items);

const {
    containerRef,
    markerRef,
    paddingTop,
    paddingBottom,
    computedItems,
    handleItemResize,
    handleScroll,
    handleScrollend,
} = useVirtual(props, toRef(flatItems.value));

const displayItems = computed(() => {
    return computedItems.value;
});

const totalColumns = computed(() => {
    return columns.value.length + (props.showSelect ? 1 : 0);
});

</script>

<template>
    <div
        :class="['ev-data-table', props.class]"
        :style="[dimensions, props.style]">
        <div>
            <ev-data-table-search />
        </div>
        <div
            ref="containerRef"
            class="ev-data-table--wrapper"
            @scroll.passive="handleScroll"
            @scrollend="handleScrollend">
            <table>
                <slot name="colgroup" />
                <tbody class="ev-data-table--tbody" role="rowgroup">
                    <tr
                        ref="markerRef"
                        class="ev-data-table--spacer-above"
                        :style="{ height: toWebUnit(paddingTop), border: 0 }">
                        <td
                            :colspan="totalColumns"
                            :style="{ height: 0, border: 0 }"></td>
                    </tr>
                    <ev-virtual-scroll-item
                        v-for="item of displayItems"
                        :key="item.index"
                        renderless
                        @update:height="(h) => handleItemResize(item.index, h)">
                        <template #default="{ itemRef }">
                            <ev-data-table-row v-bind="{ ref: itemRef, item: item.raw, index: item.index }">

                            </ev-data-table-row>
                        </template>
                    </ev-virtual-scroll-item>
                    <tr
                        class="ev-data-table--spacer-below"
                        :style="{
                            height: toWebUnit(paddingBottom),
                            border: 0,
                        }">
                        <td
                            :colspan="totalColumns"
                            :style="{ height: 0, border: 0 }"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>This is below the scrollable area</div>
    </div>
</template>
