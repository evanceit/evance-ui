<script setup lang="ts">
import { Ref, toRef, useAttrs, watch } from "vue";
import { useResizeObserver } from "../../composables/resizeObserver.ts";
import { makeEvVirtualScrollItemProps } from "./EvVirtualScroll.ts";

defineOptions({
    inheritAttrs: false,
});

defineSlots<{
    default(props: { itemRef: Ref<HTMLElement | undefined> }): any;
}>();

const props = defineProps({
    ...makeEvVirtualScrollItemProps(),
});

const emit = defineEmits(["update:height"]);
const attrs = useAttrs();

const { resizeRef, contentRect } = useResizeObserver(undefined, "border");

watch(
    () => contentRect.value?.height,
    (height) => {
        if (height != null) {
            emit("update:height", height);
        }
    },
);
</script>

<template>
    <template v-if="props.renderless">
        <slot name="default" v-bind="{ itemRef: toRef(resizeRef) }" />
    </template>
    <div
        v-else
        ref="resizeRef"
        :class="['ev-virtual-scroll--item', props.class]"
        :style="props.style"
        v-bind="attrs">
        <slot name="default" v-bind="{ itemRef: toRef(resizeRef) }" />
    </div>
</template>
