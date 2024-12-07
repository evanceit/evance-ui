<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, ref, watch } from "vue";
import { useVirtual } from "@/composables/virtual.ts";
import { filterComponentProps, omit, toWebUnit } from "@/util";
import { useDataTableItems } from "./composables/items.ts";
import EvVirtualScrollItem from "@/components/EvVirtualScroll/EvVirtualScrollItem.vue";
import { createHeaders } from "@/components/EvDataTable/composables/headers.ts";
import { EvDataTableRow } from "@/components/EvDataTable/EvDataTableRow";
import { provideSelection } from "@/components/EvDataTable/composables/select.ts";
import { EvDataTableSearch } from "@/components/EvDataTable/EvDataTableSearch";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { ItemSlot } from "@/components/EvDataTable/composables/types.ts";
import { useLocaleFunctions } from "@/composables";
import {
    EvInfiniteScroll,
    InfiniteScrollSide,
} from "@/components/EvInfiniteScroll";
import { ComponentExposed } from "vue-component-type-helpers";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    colgroup(): never;
    default(): never;
    empty(): never;
    item(props: ItemSlot): never;
}>();

const emit = defineEmits<{
    (e: "update:search", value: string): void;
    (e: "update:sort", value: string[]): void;
    (e: "update:page", value: number): void;
    (
        e: "load",
        options: {
            side: InfiniteScrollSide;
            done: () => void;
            error: () => void;
            next: () => void;
            page: number;
        },
    ): true;
}>();

const page = useModelProxy(props, "page");
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

const { t } = useLocaleFunctions();
const sort = useModelProxy(props, "sort");
const search = useModelProxy(props, "search");
const infiniteScrollRef = ref<ComponentExposed<typeof EvInfiniteScroll>>();
const infiniteScrollDisabled = computed(() => props.loading);
const isEmpty = computed(() => !computedItems.value?.length);
const searchProps = computed(() => {
    return omit(filterComponentProps(EvDataTableSearch, props), [
        "search",
        "sort",
    ]);
});

watch(
    () => infiniteScrollRef.value?.rootElement,
    (value) => {
        containerRef.value = value;
    },
);

watch(page, (newValue, oldValue) => {
    if (newValue < oldValue) {
        infiniteScrollRef.value?.reset();
    }
});

function onInfiniteScrollLoad(options) {
    const nextPage = page.value + 1;
    function next() {
        page.value = nextPage;
        options.next();
    }
    emit("load", { ...options, next, page: nextPage });
}
</script>

<template>
    <div
        :class="['ev-data-table', props.class]"
        :style="[dimensions, props.style]">
        <ev-data-table-search
            v-bind="searchProps"
            v-model:search="search"
            v-model:sort="sort" />
        <div v-if="isEmpty" class="ev-data-table--empty">
            <slot name="empty">{{ t("table.empty") }}</slot>
        </div>
        <ev-infinite-scroll
            v-else
            ref="infiniteScrollRef"
            class="ev-data-table--wrapper"
            :disabled="infiniteScrollDisabled"
            @load="onInfiniteScrollLoad"
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
    </div>
</template>
