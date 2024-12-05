<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, ref, toRef, watch } from "vue";
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
import {
    EvInfiniteScroll,
    InfiniteScrollSide,
    InfiniteScrollStatus,
} from "@/components/EvInfiniteScroll";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
    colgroup(): never;
    item(props: ItemSlot): never;
}>();

const emit = defineEmits<{
    (e: "update:search", value: string): void;
    (e: "update:sort", value: string[]): void;
    (
        e: "load",
        options: {
            side: InfiniteScrollSide;
            state: (status: InfiniteScrollStatus) => void;
        },
    ): true;
}>();

const dimensions = useDimensions(props);
const { columns, headers, sortFunctions, filterFunctions } = createHeaders(props);
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

const {
    containerRef,
    markerRef,
    paddingTop,
    paddingBottom,
    computedItems,
    handleItemResize,
    handleScroll,
    handleScrollend,
} = useVirtual(props, items);

const totalColumns = computed(() => {
    return columns.value.length + (props.showSelect ? 1 : 0);
});

const sort = useModelProxy(props, "sort");
const search = useModelProxy(props, "search");
const infiniteScrollRef = ref();

watch(
    () => infiniteScrollRef.value?.rootElement,
    (newValue) => {
        containerRef.value = newValue;
    },
);

function loadItems(e) {
    emit("load", e);
}
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
        <ev-infinite-scroll
            ref="infiniteScrollRef"
            class="ev-data-table--wrapper"
            @load="loadItems"
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
                        v-for="displayItem of computedItems"
                        :key="displayItem.index"
                        renderless
                        @update:height="
                            (h) => handleItemResize(displayItem.index, h)
                        ">
                        <template #default="{ itemRef }">
                            <ev-data-table-row
                                v-bind="{
                                    ref: itemRef,
                                    item: displayItem.raw,
                                    index: displayItem.index,
                                }">
                                <template #default="itemProps">
                                    <slot name="item" v-bind="itemProps" />
                                </template>
                                <template
                                    v-for="column in columns"
                                    :key="`item-${displayItem.index}-${column.key}`"
                                    #[`item.${column.key}`]="cellProps">
                                    <slot
                                        v-if="!slots.default"
                                        :name="`item.${column.key}`"
                                        v-bind="cellProps" />
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
        </ev-infinite-scroll>
        <div>This is below the scrollable area</div>
    </div>
</template>
