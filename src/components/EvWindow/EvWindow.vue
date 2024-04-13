<script setup lang="ts">
/**
 * EvWindow
 * ---
 */
import './EvWindow.scss';
import {EvWindowGroupSymbol, EvWindowSymbol, makeEvWindowProps} from "./EvWindow.ts";
import {useLocaleFunctions, useRtl} from "@/composables/locale.ts";
import {GroupProps, useGroup} from "@/composables/group.ts";
import {computed, provide, ref, shallowRef, watch} from "vue";
import {TouchHandlers, Touch} from "@/directives";
import {EvButton} from "@/components";

const props = defineProps(makeEvWindowProps());
const { isRtl } = useRtl();
const { t } = useLocaleFunctions();
const group = useGroup(props as any as GroupProps, EvWindowGroupSymbol);
const rootRef = ref();
const isRtlReverse = computed(() => isRtl.value ? !props.reverse : props.reverse);
const isReversed = shallowRef(false);

const transition = computed(() => {
    const axis = props.direction === 'vertical' ? 'y' : 'x';
    const reverse = isRtlReverse.value ? !isReversed.value : isReversed.value;
    const direction = reverse ? '-reverse' : '';
    return `ev-window-${axis}${direction}-transition`;
});
const transitionCount = shallowRef(0);
const transitionHeight = ref<undefined | string>(undefined);

const activeIndex = computed(() => {
    return group.items.value.findIndex(item => group.selected.value.includes(item.id));
});

watch(activeIndex, (newVal, oldVal) => {
    const itemsLength = group.items.value.length;
    const lastIndex = itemsLength - 1;
    if (itemsLength <= 2) {
        isReversed.value = newVal < oldVal;
    } else if (newVal === lastIndex && oldVal === 0) {
        isReversed.value = true;
    } else if (newVal === 0 && oldVal === lastIndex) {
        isReversed.value = false;
    } else {
        isReversed.value = newVal < oldVal;
    }
});

provide(EvWindowSymbol, {
    transition,
    isReversed,
    transitionCount,
    transitionHeight,
    rootRef,
});

const canMoveBack = computed(() => props.continuous || activeIndex.value !== 0);
const canMoveForward = computed(() => props.continuous || activeIndex.value !== group.items.value.length - 1);

function previous() {
    canMoveBack.value && group.previous();
}

function next() {
    canMoveForward.value && group.next();
}

const touchOptions = computed(() => {
    if (props.touch === false) return props.touch

    const options: TouchHandlers = {
        left: () => {
            isRtlReverse.value ? previous() : next();
        },
        right: () => {
            isRtlReverse.value ? next() : previous();
        },
        start: ({ originalEvent }) => {
            originalEvent.stopPropagation();
        }
    };

    return {
        ...options,
        ...(props.touch === true ? {} : props.touch)
    };
});

const previousProps = computed(() => {
    return {
        icon: isRtl.value ? props.iconNext : props.iconPrevious,
        class: `ev-window--${isRtlReverse.value ? 'right' : 'left'}`,
        onClick: group.previous,
        ariaLabel: t('carousel.previous')
    };
});

const nextProps = computed(() => {
    return {
        icon: isRtl.value ? props.iconPrevious : props.iconNext,
        class: `ev-window--${isRtlReverse.value ? 'left' : 'right'}`,
        onClick: group.next,
        ariaLabel: t('carousel.next')
    };
});

// explicit directive declaration
const vTouch = Touch;

</script>
<template>
    <component
        :is="props.tag"
        ref="rootRef"
        :class="[
            'ev-window',
            {
                'is-show-arrows-on-hover': props.showArrows === 'hover'
            },
            props.class
        ]"
        :style="props.style"
        v-touch="touchOptions"
    >
        <div class="ev-window--container"
             :style="{
                height: transitionHeight
             }"
        >
            <slot name="default" v-bind="{ group }"></slot>

            <div v-if="props.showArrows !== false" class="ev-window--controls">
                <slot v-if="canMoveBack" name="previous" v-bind="{ props: previousProps }">
                    <ev-button v-bind="previousProps" />
                </slot>
                <div v-else class="ev-window--control-placeholder"></div>

                <slot v-if="canMoveForward" name="next" v-bind="{ props: nextProps }">
                    <ev-button v-bind="nextProps" />
                </slot>
                <div v-else class="ev-window--control-placeholder"></div>
            </div>

        </div>
    </component>
</template>