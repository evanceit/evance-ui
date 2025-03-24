<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable";
import { useDimensions } from "@/composables/dimensions";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import { useVirtual } from "@/composables/virtual";
import { filterComponentProps, omit, toWebUnit } from "@/util";
import { DataTableItemProps, useDataTableItems } from "./composables/items";
import EvVirtualScrollItem from "@/components/EvVirtualScroll/EvVirtualScrollItem.vue";
import { createHeaders } from "@/components/EvDataTable/composables/headers";
import { EvDataTableRow } from "@/components/EvDataTable/EvDataTableRow";
import { provideSelection } from "@/components/EvDataTable/composables/select";
import { EvDataTableSearch } from "@/components/EvDataTable/EvDataTableSearch";
import { useModelProxy } from "@/composables/modelProxy";
import {
    DataTableHeader,
    ItemSlot,
} from "@/components/EvDataTable/composables/types";
import { useLocaleFunctions } from "@/composables";
import {
    EvInfiniteScroll,
    InfiniteScrollStatus,
} from "@/components/EvInfiniteScroll";
import { ComponentExposed } from "vue-component-type-helpers";
import { EvDataTableCell } from "@/components/EvDataTable/EvDataTableCell";
import { calculateDisplayRuleValue } from "@/composables/display";
import { EvCheckbox } from "@/components/EvCheckbox";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    colgroup(): never;
    default(): never;
    empty(): never;
    filters(): never;
    finished(): never;
    item(props: ItemSlot): never;
    "select-actions"(): never;
}>();

const emit = defineEmits<{
    (
        e: "load",
        options: {
            setPageItems: (
                items: DataTableItemProps["items"],
                isLastPage?: boolean,
            ) => void;
            page: number;
        },
    ): void;
    (e: "update:items", value: unknown[]): void;
    (e: "update:loading", value: boolean): void;
    (e: "update:modelValue", value: unknown[]): void;
    (e: "update:page", value: number): void;
    (e: "update:search", value: string): void;
    (e: "update:sort", value: string[]): void;
}>();

const isLoading = useModelProxy(props, "loading", false);
const itemsModel = useModelProxy(props, "items");
const pageModel = useModelProxy(props, "page");
const dimensions = useDimensions(props);
const { columns, headers } = createHeaders(props);
const { items } = useDataTableItems(itemsModel, props, columns);

const { allSelected, selectAll, showSelectAll, someSelected } =
    provideSelection(props, {
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

const spaceAbove = computed(() => toWebUnit(paddingTop.value));
const spaceBelow = computed(() => toWebUnit(paddingBottom.value));

watch(
    () => infiniteScrollRef.value?.rootElement,
    (value) => {
        containerRef.value = value;
    },
);

watch(
    () => props.filters,
    () => {
        loadFirstPage();
    },
    { deep: true },
);

function loadFirstPage() {
    isLoading.value = true;
    const nextPage = 1;
    function setPageItems(
        results: DataTableItemProps["items"],
        isLastPage: boolean = false,
    ) {
        itemsModel.value = results;
        pageModel.value = nextPage;
        /**
         * We have to wait for DOM to update before resetScroll to cater for
         * show/hiding infinite scroll from an empty state.
         */
        nextTick(() => {
            resetScroll(
                results.length < props.itemsPerPage || isLastPage
                    ? "finished"
                    : "ok",
            );
            isLoading.value = false;
        });
    }
    emit("load", { setPageItems, page: nextPage });
}

function onInfiniteScrollLoad(options) {
    const nextPage = pageModel.value + 1;
    function setPageItems(
        results: DataTableItemProps["items"],
        isLastPage: boolean = false,
    ) {
        itemsModel.value.push(...results);
        pageModel.value = nextPage;
        results.length < props.itemsPerPage || isLastPage
            ? options.done()
            : options.next();
    }
    emit("load", { setPageItems, page: nextPage });
}

function resetScroll(status: InfiniteScrollStatus = "ok") {
    infiniteScrollRef.value?.reset(status);
}

function colStyle(column: DataTableHeader) {
    return {
        width: calculateDisplayRuleValue(column.width),
        minWidth: calculateDisplayRuleValue(column.minWidth),
        maxWidth: calculateDisplayRuleValue(column.maxWidth),
    };
}

defineExpose({
    resetScroll,
    reload: loadFirstPage,
});

onMounted(() => {
    if (!itemsModel.value?.length) {
        loadFirstPage();
    }
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
            :hide-select-all="props.showHeaders"
            :filters="props.filters"
            @update:sort="loadFirstPage"
            @update:search="loadFirstPage">
            <template v-if="slots['select-actions']" #select-actions>
                <slot name="select-actions" />
            </template>
            <template v-if="slots.filters" #filters>
                <slot name="filters" />
            </template>
        </ev-data-table-search>
        <div v-if="isEmpty" class="ev-data-table--empty">
            <slot name="empty">{{ t("table.empty") }}</slot>
        </div>
        <ev-infinite-scroll
            v-else
            ref="infiniteScrollRef"
            class="ev-data-table--wrapper"
            :disabled="infiniteScrollDisabled"
            :show-finished="props.showFinished"
            @load="onInfiniteScrollLoad"
            @scroll.passive="handleScroll"
            @scrollend="handleScrollend">
            <template #finished>
                <slot name="finished" />
            </template>
            <table class="ev-data-table--native">
                <slot name="colgroup">
                    <colgroup>
                        <col v-if="props.showSelect" />
                        <col
                            v-for="(column, colIndex) of columns"
                            :key="colIndex"
                            :style="colStyle(column)" />
                    </colgroup>
                </slot>
                <thead
                    v-if="props.showHeaders"
                    class="ev-data-table--thead"
                    role="rowgroup">
                    <tr v-for="(row, rowIndex) of headers" :key="rowIndex">
                        <ev-data-table-cell
                            v-if="showSelectAll && rowIndex === 0"
                            tag="th"
                            :colspan="1"
                            :rowspan="headers.length"
                            class="ev-data-table-cell--checkbox">
                            <ev-checkbox
                                :model-value="allSelected"
                                :indeterminate="someSelected && !allSelected"
                                @update:model-value="selectAll" />
                        </ev-data-table-cell>
                        <ev-data-table-cell
                            v-for="(header, headerIndex) of row"
                            :key="headerIndex"
                            tag="th"
                            v-bind="header.headerProps"
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
                        :style="{ height: spaceAbove, border: 0 }">
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
                        :style="{ height: spaceBelow, border: 0 }">
                        <td
                            :colspan="totalColumns"
                            :style="{ height: 0, border: 0 }"></td>
                    </tr>
                </tbody>
            </table>
        </ev-infinite-scroll>
    </div>
</template>
