<script setup lang="ts">
import "./EvInfiniteScroll.scss";
import { makeEvInfiniteScrollProps } from "./EvInfiniteScroll.ts";
import { useDimensions } from "@/composables/dimensions.ts";

const props = defineProps({ ...makeEvInfiniteScrollProps() });
const dimensions = useDimensions(props);
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-infinite-scroll']"
        :style="[dimensions]">

        Infinite Scroll

    </component>
</template>
