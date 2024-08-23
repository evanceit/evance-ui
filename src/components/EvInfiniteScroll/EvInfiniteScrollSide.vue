<script setup lang="ts">
import { computed, PropType } from "vue";
import {
    InfiniteScrollMode,
    InfiniteScrollSide,
    InfiniteScrollStatus,
} from "./EvInfiniteScroll.ts";
import { useLocaleFunctions } from "@/composables";
import { EvButton } from "@/components/EvButton";
import { EvProgressCircular } from "@/components/EvProgressCircular";

const props = defineProps({
    mode: {
        type: String as PropType<InfiniteScrollMode>,
        default: undefined,
    },
    side: {
        type: String as PropType<InfiniteScrollSide>,
        default: undefined,
    },
    status: {
        type: String as PropType<InfiniteScrollStatus>,
        default: undefined,
    },
    textFinished: {
        type: String,
        default: undefined,
    },
    textMore: {
        type: String,
        default: undefined,
    },
});

const slots = defineSlots<{
    error(props: {
        side: InfiniteScrollSide;
        props: { onClick: () => void };
    }): never;
    finished(props: {
        side: InfiniteScrollSide;
        props: { onClick: () => void };
    }): never;
    loading(props: {
        side: InfiniteScrollSide;
        props: { onClick: () => void };
    }): never;
    more(props: {
        side: InfiniteScrollSide;
        props: { onClick: () => void };
    }): never;
}>();

const emit = defineEmits(["click:more"]);

const onClick = () => {
    emit("click:more");
};

const slotProps = {
    side: props.side,
    props: {
        onClick,
    },
};

const { t } = useLocaleFunctions();

const isError = computed(() => props.status === "error");
const isFinished = computed(() => props.status === "finished");
const isManual = computed(() => props.mode === "manual");
const isLoading = computed(() => props.status === "loading");
</script>

<template>
    <div class="ev-infinite-scroll-side">
        <template v-if="isError">
            <slot name="error" v-bind="slotProps" />
        </template>
        <template v-else-if="isFinished">
            <slot name="finished" v-bind="slotProps">
                <div class="ev-infinite-scroll-finished">
                    {{ t(props.textFinished) }}
                </div>
            </slot>
        </template>
        <template v-else-if="isManual">
            <slot v-if="!isLoading" name="more" v-bind="slotProps">
                <ev-button @click="onClick">
                    {{ t(props.textMore) }}
                </ev-button>
            </slot>
            <slot v-else name="loading" v-bind="slotProps">
                <ev-button loading>
                    {{ t(props.textMore) }}
                </ev-button>
            </slot>
        </template>
        <template v-else>
            <slot name="loading" v-bind="slotProps">
                <ev-progress-circular indeterminate />
            </slot>
        </template>
    </div>
</template>
