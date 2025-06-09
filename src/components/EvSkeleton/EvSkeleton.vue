<script setup lang="ts">
import "./EvSkeleton.scss";
import { makeEvSkeletonProps } from "./EvSkeleton";
import { computed } from "vue";
import { useRounded } from "@/composables/rounded";
import { useDimensions } from "@/composables";

const props = defineProps({ ...makeEvSkeletonProps() });

const rounded = computed(() => {
    return props.rounded ?? props.shape === "circle";
});

const { roundedClasses } = useRounded(rounded);
const dimensionStyles = useDimensions(props);
</script>

<template>
    <div
        :class="['ev-skeleton', roundedClasses, props.class]"
        :style="[dimensionStyles, props.style]"
        aria-hidden="true"></div>
</template>
