<script setup lang="ts">
/**
 * EvWindow
 * ---
 */
import "./EvWindow.scss";
import {
    EvWindowGroupSymbol,
    EvWindowSymbol,
    makeEvWindowProps,
} from "./EvWindow.ts";
import { useLocaleFunctions, useRtl } from "@/composables/locale";
import { GroupProps, useGroup } from "@/composables/group";
import { computed, provide, ref, shallowRef, watch } from "vue";
import { TouchHandlers, Touch } from "@/directives";
import { EvButton } from "@/components";
import { IconValue } from "@/composables/icons";

const props = defineProps({
    ...makeEvWindowProps(),
});
defineSlots<{
    default(): never;
    next(props: {
        props: {
            icon: IconValue;
            class: string;
            onClick: () => void;
            ariaLabel: string;
        };
    }): never;
    previous(props: {
        props: {
            icon: IconValue;
            class: string;
            onClick: () => void;
            ariaLabel: string;
        };
    }): never;
}>();

const { isRtl } = useRtl();
const { t } = useLocaleFunctions();
const group = useGroup(props as any as GroupProps, EvWindowGroupSymbol);
const rootRef = ref();
const isRtlReverse = computed(() =>
    isRtl.value ? !props.reverse : props.reverse,
);
const isReversed = shallowRef(false);

const transition = computed(() => {
    const axis = props.direction === "vertical" ? "y" : "x";
    const reverse = isRtlReverse.value ? !isReversed.value : isReversed.value;
    const direction = reverse ? "-reverse" : "";
    return `ev-window-${axis}${direction}-transition`;
});
const transitionCount = shallowRef(0);
const transitionHeight = ref<undefined | string>(undefined);

const activeIndex = computed(() => {
    return group.items.value.findIndex((item) =>
        group.selected.value.includes(item.id),
    );
});

const canMoveBack = computed(() => props.continuous || activeIndex.value !== 0);
const canMoveForward = computed(
    () =>
        props.continuous || activeIndex.value !== group.items.value.length - 1,
);

function previous() {
    lastAction = "previous";
    canMoveBack.value && group.previous();
}

function next() {
    lastAction = "next";
    canMoveForward.value && group.next();
}

const touchOptions = computed(() => {
    if (props.touch === false) return props.touch;

    const options: TouchHandlers = {
        left: () => {
            isRtlReverse.value ? previous() : next();
        },
        right: () => {
            isRtlReverse.value ? next() : previous();
        },
        start: ({ originalEvent }) => {
            originalEvent.stopPropagation();
        },
    };

    return {
        ...options,
        ...(props.touch === true ? {} : props.touch),
    };
});

const previousProps = computed(() => {
    return {
        icon: isRtl.value ? props.iconNext : props.iconPrevious,
        class: `ev-window--${isRtlReverse.value ? "right" : "left"}`,
        onClick: previous,
        ariaLabel: t("carousel.previous"),
    };
});

const nextProps = computed(() => {
    return {
        icon: isRtl.value ? props.iconPrevious : props.iconNext,
        class: `ev-window--${isRtlReverse.value ? "left" : "right"}`,
        onClick: next,
        ariaLabel: t("carousel.next"),
    };
});

// explicit directive declaration
const vTouch = Touch;

let lastAction: "next" | "previous" | undefined;
watch(activeIndex, (newVal, oldVal) => {
    isReversed.value = isRtlReverse.value
        ? lastAction === "next" ||
          (lastAction !== "previous" && newVal > oldVal)
        : lastAction === "previous" ||
          (lastAction !== "next" && newVal < oldVal);
    lastAction = undefined;
});

provide(EvWindowSymbol, {
    transition,
    isReversed,
    transitionCount,
    transitionHeight,
    rootRef,
});

defineExpose({
    canMoveBack,
    canMoveForward,
    previous,
    next,
});
</script>

<template>
    <component
        :is="props.tag"
        ref="rootRef"
        v-touch="touchOptions"
        :class="[
            'ev-window',
            {
                'is-show-arrows-on-hover': props.showArrows === 'hover',
            },
            props.class,
        ]"
        :style="props.style">
        <div
            class="ev-window--container"
            :style="{
                height: transitionHeight,
            }">
            <slot name="default" v-bind="{ group }"></slot>

            <div v-if="props.showArrows !== false" class="ev-window--controls">
                <slot
                    v-if="canMoveBack"
                    name="previous"
                    v-bind="{ props: previousProps }">
                    <ev-button v-bind="previousProps" />
                </slot>
                <div v-else class="ev-window--control-placeholder"></div>

                <slot
                    v-if="canMoveForward"
                    name="next"
                    v-bind="{ props: nextProps }">
                    <ev-button v-bind="nextProps" />
                </slot>
                <div v-else class="ev-window--control-placeholder"></div>
            </div>
        </div>
    </component>
</template>
