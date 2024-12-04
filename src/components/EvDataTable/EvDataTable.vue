<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, toRef } from "vue";
import { useVirtual } from "@/composables/virtual.ts";
import { toWebUnit } from "@/util";
import { useDataTableItems } from "./composables/items.ts";
import EvVirtualScrollItem from "@/components/EvVirtualScroll/EvVirtualScrollItem.vue";
import { createHeaders } from "@/components/EvDataTable/composables/headers.ts";
import { EvDataTableRow } from "@/components/EvDataTable/EvDataTableRow";
import { provideSelection } from "@/components/EvDataTable/composables/select.ts";
import { EvDataTableSearch } from "@/components/EvDataTable/EvDataTableSearch";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { ItemSlot } from "@/components/EvDataTable/composables/types.ts";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
    colgroup(): never;
    item(props: ItemSlot): never;
}>();

defineEmits(["update:search", "update:sort"]);

const dimensions = useDimensions(props);
const { columns, headers, sortFunctions, filterFunctions } = createHeaders(
    props,
    {
        showSelect: toRef(props, "showSelect"),
});

const { items } = useDataTableItems(props, columns);

const {
    selected,
    isSelected,
    select,
    selectAll,
    toggleSelect,
    someSelected,
    allSelected,
} = provideSelection(props, { allItems: items, currentPage: items });

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

const sort = useModelProxy(props, "sort");
const search = useModelProxy(props, "search");

</script>

<template>
    <div
        :class="['ev-data-table', props.class]"
        :style="[dimensions, props.style]">
        <div>
            <ev-data-table-search
                v-model:search="search"
                v-model:sort="sort"
                :search-placeholder="props.searchPlaceholder"
                :sort-options="props.sortOptions" />
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
                        v-for="displayItem of displayItems"
                        :key="displayItem.index"
                        renderless
                        @update:height="
                            (h) => handleItemResize(displayItem.index, h)
                        ">
                        <template #default>
                            <ev-data-table-row
                                v-bind="{
                                    item: displayItem.raw,
                                    index: displayItem.index,
                                }">
                                <template #default="slotProps">
                                    <slot name="item" v-bind="slotProps" />
                                </template>
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
