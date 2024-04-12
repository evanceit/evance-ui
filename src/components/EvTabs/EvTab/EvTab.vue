<script setup lang="ts">
/**
 * # EvTab
 */
import './EvTab.scss';
import {makeEvTabProps} from "./EvTab.ts";
import {EvButton} from "@/components/EvButton";
import {EvTabsSymbol} from "@/components/EvTabs/EvTabs.ts";
import {computed, ref, shallowRef} from "vue";
import {animate, easingStandard, filterComponentProps} from "@/util";
import {useDefaults} from "@/composables";

const definedProps = defineProps(makeEvTabProps());
const props = useDefaults(definedProps);
const isSelected = shallowRef(false);
const isHorizontal = computed(() => props.direction === 'horizontal');
const buttonProps = computed(() => {
    return filterComponentProps(EvButton, props);
});
const rootEl = ref<typeof EvButton>();
const sliderEl = ref<HTMLElement>();

function updateSlider({ value }: { value: boolean }) {

    if (!value) {
        return;
    }

    const prevEl: HTMLElement | undefined = rootEl.value?.$el.parentElement?.querySelector('.ev-tab.is-selected .ev-tab--slider');
    const nextEl = sliderEl.value;
    if (!prevEl || !nextEl) {
        return;
    }

    const color = getComputedStyle(prevEl).color;
    const prevBox = prevEl.getBoundingClientRect();
    const nextBox = nextEl.getBoundingClientRect();

    const xy = isHorizontal.value ? 'x' : 'y';
    const XY = isHorizontal.value ? 'X' : 'Y';
    const rightBottom = isHorizontal.value ? 'right' : 'bottom';
    const widthHeight = isHorizontal.value ? 'width' : 'height';

    const prevPos = prevBox[xy];
    const nextPos = nextBox[xy];
    const delta = prevPos > nextPos
        ? prevBox[rightBottom] - nextBox[rightBottom]
        : prevBox[xy] - nextBox[xy];


    const origin =
        Math.sign(delta) > 0 ? (isHorizontal.value ? 'right' : 'bottom')
            : Math.sign(delta) < 0 ? (isHorizontal.value ? 'left' : 'top')
                : 'center';

    const size = Math.abs(delta) + (Math.sign(delta) < 0 ? prevBox[widthHeight] : nextBox[widthHeight]);
    const scale = size / Math.max(prevBox[widthHeight], nextBox[widthHeight]) || 0;
    const initialScale = prevBox[widthHeight] / nextBox[widthHeight] || 0;

    const sigma = 1.5;
    animate(nextEl, {
        backgroundColor: [color, 'currentcolor'],
        transform: [
            `translate${XY}(${delta}px) scale${XY}(${initialScale})`,
            `translate${XY}(${delta / sigma}px) scale${XY}(${(scale - 1) / sigma + 1})`,
            'none',
        ],
        transformOrigin: Array(3).fill(origin),
    }, {
        duration: 225,
        easing: easingStandard,
    });
}
</script>
<template>
    <ev-button
        ref="rootEl"
        role="tab"
        :class="[
            'ev-tab',
            props.class
        ]"
        :active="undefined"
        :aria-selected="String(isSelected)"
        :symbol="EvTabsSymbol"
        :tabindex="isSelected ? 0 : -1"
        :style="props.style"
        v-bind="buttonProps"
        @group:selected="updateSlider"
    >
        <slot name="default">{{ props.text }}</slot>

        <div
            ref="sliderEl"
            :class="[
                'ev-tab--slider'
            ]"
        ></div>
    </ev-button>
</template>