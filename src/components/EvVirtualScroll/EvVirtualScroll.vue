<script setup lang="ts">
import { makeEvVirtualScrollProps } from "./EvVirtualScroll";
import { getCurrentComponent, getScrollParent, toWebUnit } from "@/util";
import { useDimensions } from "@/composables/dimensions";
import { onMounted, onScopeDispose, Ref, toRef } from "vue";
import { useVirtual, VirtualProps } from "@/composables/virtual";
import { useToggleScope } from "@/composables/toggleScope";
import EvVirtualScrollItem from "./EvVirtualScrollItem.vue";

const props = defineProps({
    ...makeEvVirtualScrollProps(),
});
const component = getCurrentComponent("EvVirtualScroll");
const dimensionStyles = useDimensions(props);
const {
    calculateVisibleItems,
    containerRef,
    markerRef,
    handleScroll,
    handleScrollend,
    handleItemResize,
    scrollToIndex,
    paddingTop,
    paddingBottom,
    computedItems,
} = useVirtual(props as VirtualProps, toRef(props, "items"));

useToggleScope(
    () => props.renderless,
    () => {
        function toggleEventListeners(add = false) {
            const method = add ? "addEventListener" : "removeEventListener";
            if (containerRef.value === document.documentElement) {
                document[method]("scroll", handleScroll, { passive: true });
                document[method]("scrollend", handleScrollend);
            } else {
                containerRef.value?.[method]("scroll", handleScroll, {
                    passive: true,
                });
                containerRef.value?.[method]("scrollend", handleScrollend);
            }
        }
        onMounted(() => {
            containerRef.value = getScrollParent(
                component.vnode.el as HTMLElement,
                true,
            );
            toggleEventListeners(true);
        });
        onScopeDispose(toggleEventListeners);
    },
);

defineExpose({
    calculateVisibleItems,
    scrollToIndex,
});

defineSlots<{
    default(props: {
        item: any;
        index: number;
        itemRef: Ref<HTMLElement | undefined>;
    }): any;
}>();
</script>

<template>
    <template v-if="props.renderless">
        <div
            ref="markerRef"
            class="ev-virtual-scroll--spacer"
            :style="{ paddingTop: toWebUnit(paddingTop) }"></div>
        <ev-virtual-scroll-item
            v-for="item in computedItems"
            :key="item.index"
            :renderless="props.renderless"
            @update:height="(h) => handleItemResize(item.index, h)">
            <template #default="{ itemRef }">
                <slot v-bind="{ item: item.raw, index: item.index, itemRef }" />
            </template>
        </ev-virtual-scroll-item>
        <div
            class="ev-virtual-scroll--spacer"
            :style="{ paddingBottom: toWebUnit(paddingBottom) }"></div>
    </template>

    <div
        v-else
        ref="containerRef"
        :class="['ev-virtual-scroll', props.class]"
        :style="[dimensionStyles, props.style]"
        @scroll.passive="handleScroll"
        @scrollend="handleScrollend">
        <div
            ref="markerRef"
            class="ev-virtual-scroll--container"
            :style="[
                {
                    paddingTop: toWebUnit(paddingTop),
                    paddingBottom: toWebUnit(paddingBottom),
                },
            ]">
            <ev-virtual-scroll-item
                v-for="item in computedItems"
                :key="item.index"
                :renderless="props.renderless"
                @update:height="(h) => handleItemResize(item.index, h)">
                <template #default="{ itemRef }">
                    <slot
                        name="default"
                        v-bind="{
                            item: item.raw,
                            index: item.index,
                            itemRef,
                        }" />
                </template>
            </ev-virtual-scroll-item>
        </div>
    </div>
</template>
