<script setup lang="ts">
import "./EvInfiniteScroll.scss";
import {
    InfiniteScrollSide,
    InfiniteScrollStatus,
    makeEvInfiniteScrollProps,
} from "./EvInfiniteScroll.ts";
import { useDimensions } from "@/composables/dimensions.ts";
import {computed, nextTick, onMounted, ref, shallowRef, toRef} from "vue";
import { toWebUnit } from "@/util";
import EvInfiniteScrollSide from "@/components/EvInfiniteScroll/EvInfiniteScrollSide.vue";
import EvInfiniteScrollIntersect from "@/components/EvInfiniteScroll/EvInfiniteScrollIntersect.vue";

const props = defineProps({ ...makeEvInfiniteScrollProps() });
const slots = defineSlots<{
    default(): never;
    error(): never;
    finished(): never;
    loading(): never;
    more(): never;
}>();
const emit = defineEmits<{
    (
        e: "load",
        options: {
            side: InfiniteScrollSide;
            state: (status: InfiniteScrollStatus) => void;
        },
    ): true;
}>();
const dimensions = useDimensions(props);
const rootEl = ref<HTMLDivElement>();
const startStatus = shallowRef<InfiniteScrollStatus>("ok");
const endStatus = shallowRef<InfiniteScrollStatus>("ok");
const margin = computed(() => toWebUnit(props.margin));
const isIntersecting = shallowRef(false);
let previousScrollSize = 0;

const isDisabled = toRef(props, "disabled");

const hasStartIntersect = computed(() => {
    return props.side === "start" || props.side === "both";
});

const hasEndIntersect = computed(() => {
    return props.side === "end" || props.side === "both";
});

const intersectMode = computed(() => {
    return props.mode === "intersect";
});

function getContainerSize() {
    if (!rootEl.value) {
        return 0;
    }
    const property =
        props.direction === "vertical" ? "clientHeight" : "clientWidth";
    return rootEl.value[property];
}

function getScrollAmount() {
    if (!rootEl.value) {
        return 0;
    }
    const property =
        props.direction === "vertical" ? "scrollTop" : "scrollLeft";
    return rootEl.value[property];
}

function getScrollSize() {
    if (!rootEl.value) {
        return 0;
    }
    const property =
        props.direction === "vertical" ? "scrollHeight" : "scrollWidth";
    return rootEl.value[property];
}

function getStatus(side: string) {
    return side === "start" ? startStatus.value : endStatus.value;
}

function handleIntersect(side: InfiniteScrollSide, _isIntersecting: boolean) {
    isIntersecting.value = _isIntersecting;
    if (isIntersecting.value && !isDisabled.value) {
        intersecting(side);
    }
}

function intersecting(side: InfiniteScrollSide) {
    if (props.mode !== "manual" && !isIntersecting.value) {
        return;
    }
    const status = getStatus(side);
    if (!rootEl.value || status === "loading") {
        return;
    }
    previousScrollSize = getScrollSize();
    setStatus(side, "loading");

    function state(status: InfiniteScrollStatus) {
        setStatus(side, status);
        // Triggering a scroll event here allows InfiniteScroll to work with VirtualScroll
        // without any additional listeners
        rootEl.value.dispatchEvent(new Event("scroll"));

        nextTick(() => {
            if (status === "finished" || status === "error") {
                return;
            }
            if (status === "ok" && side === "start") {
                setScrollAmount(
                    getScrollSize() - previousScrollSize + getScrollAmount(),
                );
            }
            if (props.mode !== "manual") {
                nextTick(() => {
                    window.requestAnimationFrame(() => {
                        window.requestAnimationFrame(() => {
                            window.requestAnimationFrame(() => {
                                intersecting(side);
                            });
                        });
                    });
                });
            }
        });
    }

    emit("load", { side, state });
}

function setScrollAmount(amount: number) {
    if (!rootEl.value) {
        return;
    }
    const property =
        props.direction === "vertical" ? "scrollTop" : "scrollLeft";
    rootEl.value[property] = amount;
}

function setStatus(side: InfiniteScrollSide, status: InfiniteScrollStatus) {
    if (side === "start") {
        startStatus.value = status;
    } else if (side === "end") {
        endStatus.value = status;
    }
}

onMounted(() => {
    if (!rootEl.value) {
        return;
    }
    if (props.side === "start") {
        setScrollAmount(getScrollSize());
    } else if (props.side === "both") {
        setScrollAmount(getScrollSize() / 2 - getContainerSize() / 2);
    }
});

const sideProps = computed(() => ({
    mode: props.mode,
    textFinished: props.textFinished,
    textMore: props.textMore,
}));
</script>

<template>
    <component
        :is="props.tag"
        ref="rootEl"
        :class="[
            'ev-infinite-scroll',
            `ev-infinite-scroll--${props.direction}`,
            {
                'ev-infinite-scroll--start': hasStartIntersect,
                'ev-infinite-scroll-end': hasEndIntersect,
            },
        ]"
        :style="[dimensions]">
        <ev-infinite-scroll-side
            v-if="['start', 'both'].includes(props.side) && !isDisabled"
            side="start"
            v-bind="sideProps"
            :status="startStatus"
            @click:more="intersecting('start')">
            <template v-if="slots.finished" #finished="{ side, props }">
                <slot name="finished" :side="side" :props="props" />
            </template>
            <template v-if="slots.error" #error="{ side, props }">
                <slot name="error" :side="side" :props="props" />
            </template>
            <template v-if="slots.loading" #loading="{ side, props }">
                <slot name="loading" :side="side" :props="props" />
            </template>
            <template v-if="slots.more" #more="{ side, props }">
                <slot name="more" :side="side" :props="props" />
            </template>
        </ev-infinite-scroll-side>

        <ev-infinite-scroll-intersect
            v-if="rootEl && hasStartIntersect && intersectMode && !isDisabled"
            key="start"
            side="start"
            :root-ref="rootEl"
            :root-margin="margin"
            @intersect="handleIntersect" />

        <slot name="default" />

        <ev-infinite-scroll-intersect
            v-if="rootEl && hasEndIntersect && intersectMode && !isDisabled"
            key="end"
            side="end"
            :root-ref="rootEl"
            :root-margin="margin"
            @intersect="handleIntersect" />

        <ev-infinite-scroll-side
            v-if="['end', 'both'].includes(props.side) && !isDisabled"
            side="end"
            v-bind="sideProps"
            :status="endStatus"
            @click:more="intersecting('end')">
            <template v-if="slots.finished" #finished="{ side, props }">
                <slot name="finished" :side="side" :props="props" />
            </template>
            <template v-if="slots.error" #error="{ side, props }">
                <slot name="error" :side="side" :props="props" />
            </template>
            <template v-if="slots.loading" #loading="{ side, props }">
                <slot name="loading" :side="side" :props="props" />
            </template>
            <template v-if="slots.more" #more="{ side, props }">
                <slot name="more" :side="side" :props="props" />
            </template>
        </ev-infinite-scroll-side>
    </component>
</template>
