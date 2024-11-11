<script setup lang="ts">
import "./EvDataTable.scss";
import { makeEvDataTableProps } from "./EvDataTable.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import { computed, toRef } from "vue";
import { useVirtual } from "@/composables/virtual.ts";
import { toWebUnit } from "@/util";
import { useDataTableItems } from "./composables/items.ts";
import EvVirtualScrollItem from "@/components/EvVirtualScroll/EvVirtualScrollItem.vue";
import { createGroupBy } from "@/components/EvDataTable/composables/group.ts";
import { createHeaders } from "@/components/EvDataTable/composables/headers.ts";

const props = defineProps({ ...makeEvDataTableProps() });
const slots = defineSlots<{
    default(): never;
}>();

const dimensions = useDimensions(props);
const { groupBy } = createGroupBy(props);
const { columns, headers } = createHeaders(props, {
    groupBy,
    showSelect: toRef(props, "showSelect"),
    showExpand: toRef(props, "showExpand"),
});

const { items } = useDataTableItems(props, columns);
const flatItems = computed(() => props.items);

const {
    containerRef,
    markerRef,
    paddingTop,
    paddingBottom,
    computedItems,
    handleItemResize,
    handleScroll,
    handleScrollend,
} = useVirtual(props, flatItems);

const displayItems = computed(() => {
    return computedItems.value;
});

const totalColumns = computed(() => {
    return columns.value.length;
});
</script>

<template>
    <div
        :class="['ev-data-table', props.class]"
        :style="[dimensions, props.style]">
        <div>This is above the scrollable area</div>
        <div
            ref="containerRef"
            class="ev-data-table--wrapper"
            @scroll.passive="handleScroll"
            @scrollend="handleScrollend">
            <table>
                <tbody role="rowgroup">
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
                            <tr v-bind="{ ref: itemRef }">
                                <td>{{ item.raw.name }}</td>
                            </tr>
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
