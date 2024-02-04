<script setup lang="ts">

import {useAttrs, useSlots, watch} from "vue";
import {useResizeObserver} from "../../composables/resizeObserver.ts";
import {makeEvVirtualScrollItemProps} from "./EvVirtualScroll.ts";

defineOptions({
    inheritAttrs: false
});

const props = defineProps(makeEvVirtualScrollItemProps());

const emit = defineEmits([
    'update:height'
]);
const attrs = useAttrs();

const { resizeRef, contentRect } = useResizeObserver(undefined, 'border');

watch(() => contentRect.value?.height, height => {
    if (height != null) {
        emit('update:height', height);
    }
});

</script>
<template>
    <template v-if="props.renderless">
        <slot v-bind="{ itemRef: resizeRef }" />
    </template>
    <div v-else
         ref="resizeRef"
         :class="[
             'ev-virtual-scroll--item',
             props.class
         ]"
         :style="props.style"
         v-bind="attrs"
    >
        <slot />
    </div>
</template>