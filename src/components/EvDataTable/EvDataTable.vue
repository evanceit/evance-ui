<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, ref, watch } from "vue";
import { useVirtual } from "@/composables/virtual.ts";
import { filterComponentProps, omit, toWebUnit } from "@/util";
import { DataTableItemProps, useDataTableItems } from "./composables/items.ts";
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
    InfiniteScrollStatus,
} from "@/components/EvInfiniteScroll";
import { ComponentExposed } from "vue-component-type-helpers";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";

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
            next: (nextItems: DataTableItemProps["items"]) => void;
            page: number;
        },
    ): void;
}>();

const isLoading = useModelProxy(props, "loading");
const itemsModel = useModelProxy(props, "items");
const pageModel = useModelProxy(props, "page");
const dimensions = useDimensions(props);
const { columns, headers, sortFunctions, filterFunctions } = createHeaders(props);
const { items } = useDataTableItems(itemsModel, props, columns);

const { selected, isSelected, select } = provideSelection(props, {
    allItems: items,
    currentPage: items,
});

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
const sortModel = useModelProxy(props, "sort");
const searchModel = useModelProxy(props, "search");
const infiniteScrollRef = ref<ComponentExposed<typeof EvInfiniteScroll>>();
const infiniteScrollDisabled = computed(() => isLoading.value);
const isEmpty = computed(() => !itemsModel.value?.length);
const searchProps = computed(() => {
    return omit(filterComponentProps(EvDataTableSearch, props), [
        "loading",
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

function onChange() {
    isLoading.value = true;
    const nextPage = 1;
    function next(results: DataTableItemProps["items"]) {
        itemsModel.value = results;
        pageModel.value = nextPage;
        isLoading.value = false;
        resetScroll(results.length < props.itemsPerPage ? "finished" : "ok");
    }
    emit("load", { next, page: nextPage });
}

function onInfiniteScrollLoad(options) {
    const nextPage = pageModel.value + 1;
    function next(results: DataTableItemProps["items"]) {
        itemsModel.value.push(...results);
        pageModel.value = nextPage;
        results.length < props.itemsPerPage ? options.done() : options.next();
    }
    emit("load", { next, page: nextPage });
}

function resetScroll(status: InfiniteScrollStatus = "ok") {
    infiniteScrollRef.value?.reset(status);
}

defineExpose({
    resetScroll,
});
</script>

<template>
    <div
        :class="['ev-data-table', props.class]"
        :style="[dimensions, props.style]">
        <ev-data-table-search
            v-bind="searchProps"
            v-model:search="searchModel"
            v-model:sort="sortModel"
            :loading="isLoading"
            @update:sort="onChange"
            @update:search="onChange" />
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
            <table class="ev-data-table--native">
                <slot name="colgroup" />
                <thead
                    v-if="props.showHeaders"
                    class="ev-data-table--thead"
                    role="rowgroup">
                    <tr v-for="(row, rowIndex) of headers" :key="rowIndex">
                        <ev-data-table-cell
                            v-if="props.showSelect && rowIndex === 0"
                            tag="th"
                            :colspan="1"
                            :rowspan="headers.length">
                            &nbsp;
                        </ev-data-table-cell>
                        <ev-data-table-cell
                            v-for="(header, headerIndex) of row"
                            :key="headerIndex"
                            tag="th"
                            :align="header.align"
                            :colspan="header.colspan"
                            :rowspan="header.rowspan">
                            <slot
                                :name="`header.${header.key}`"
                                v-bind="{ header }">
                                {{ header.title }}
                            </slot>
                        </ev-data-table-cell>
                    </tr>
                </thead>
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
                                        v-if="!slots.item"
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
