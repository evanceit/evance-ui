<script setup lang="ts">
import { useIntersectionObserver } from "@/composables/intersectionObserver";
import { InfiniteScrollSide } from "@/components/EvInfiniteScroll";
import { PropType, watch } from "vue";

const props = defineProps({
    side: {
        type: String as PropType<InfiniteScrollSide>,
        required: true,
    },
    rootRef: {
        type: Object as PropType<HTMLDivElement>,
        default: null,
    },
    rootMargin: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits<{
    (e: "intersect", side: InfiniteScrollSide, isIntersecting: boolean): true;
}>();

const options = {
    ...(props.rootMargin ? { rootMargin: props.rootMargin } : {}),
    ...(props.rootRef ? { root: props.rootRef } : {}),
};

const { intersectionRef, isIntersecting } = useIntersectionObserver(
    () => {},
    options,
);

watch(isIntersecting, async (val) => {
    emit("intersect", props.side, val);
});
</script>

<template>
    <div ref="intersectionRef" class="ev-infinite-scroll-intersect">&nbsp;</div>
</template>
