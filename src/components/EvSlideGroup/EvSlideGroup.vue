<script setup lang="ts">
/**
 * # EvSlideGroup
 */
import './EvSlideGroup.scss';
import {EvButton, EvSlideGroupSlot, makeEvSlideGroupProps} from "@/components";
import {useDisplayRuleClasses} from "@/composables/display.ts";
import {computed, shallowRef, watch} from "vue";
import {Browser, clamp, focusableChildren, isBoolean} from "@/util";
import {GroupProps, useGroup} from "@/composables/group.ts";
import {useResizeObserver} from "@/composables/resizeObserver.ts";
import {bias, calculateCenteredOffset, calculateUpdatedOffset} from "@/components/EvSlideGroup/helpers.ts";
import {ChevronDown, ChevronLeft, ChevronRight, ChevronUp} from "@/icons";

defineSlots<EvSlideGroupSlot>();

const props = defineProps(makeEvSlideGroupProps());
const group = useGroup(props as any as GroupProps, props.symbol);
const isRtl = shallowRef(false); // @todo: Implement rtl from locale
const isFocused = shallowRef(false);
const isOverflowing = shallowRef(false);
const scrollOffset = shallowRef(0);
const containerSize = shallowRef(0);
const contentSize = shallowRef(0);
const isHorizontal = computed(() => props.direction === 'horizontal');
const disableTransition = shallowRef(false);

const { resizeRef: containerRef, contentRect: containerRect } = useResizeObserver();
const { resizeRef: contentRef, contentRect } = useResizeObserver();

const firstSelectedIndex = computed(() => {
    if (!group.selected.value.length) {
        return -1;
    }
    return group.items.value.findIndex(item => item.id === group.selected.value[0]);
});

const lastSelectedIndex = computed(() => {
    if (!group.selected.value.length) {
        return -1;
    }
    return group.items.value.findIndex(item => item.id === group.selected.value[group.selected.value.length - 1]);
});

if (Browser.hasWindow) {
    let frame = -1;
    watch(
        () => [group.selected.value, containerRect.value, contentRect.value, isHorizontal.value],
        () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (containerRect.value && contentRect.value) {
                    const sizeProperty = isHorizontal.value ? 'width' : 'height';
                    containerSize.value = containerRect.value[sizeProperty];
                    contentSize.value = contentRect.value[sizeProperty];
                    isOverflowing.value = containerSize.value + 1 < contentSize.value;
                }

                if (firstSelectedIndex.value >= 0 && contentRef.value) {
                    // @todo: Is this too naive? Should we store element references in group composable?
                    const selectedElement = contentRef.value.children[lastSelectedIndex.value] as HTMLElement;

                    if (firstSelectedIndex.value === 0 || !isOverflowing.value) {
                        scrollOffset.value = 0;
                    } else if (props.centerActive) {
                        scrollOffset.value = calculateCenteredOffset({
                            selectedElement,
                            containerSize: containerSize.value,
                            contentSize: contentSize.value,
                            isRtl: isRtl.value,
                            isHorizontal: isHorizontal.value,
                        });
                    } else if (isOverflowing.value) {
                        scrollOffset.value = calculateUpdatedOffset({
                            selectedElement,
                            containerSize: containerSize.value,
                            contentSize: contentSize.value,
                            isRtl: isRtl.value,
                            currentScrollOffset: scrollOffset.value,
                            isHorizontal: isHorizontal.value,
                        });
                    }
                }
            });
        }
    );
}

/**
 * ## focus
 * @param location
 */
function focus(location?: 'next' | 'previous' | 'first' | 'last') {
    if (!contentRef.value) {
        return;
    }
    if (!location) {
        const focusable = focusableChildren(contentRef.value);
        focusable[0]?.focus();
    } else if (location === 'next') {
        const el = contentRef.value.querySelector(':focus')?.nextElementSibling as HTMLElement | undefined;
        if (el) {
            el.focus();
        } else {
            focus('first');
        }
    } else if (location === 'previous') {
        const el = contentRef.value.querySelector(':focus')?.previousElementSibling as HTMLElement | undefined;
        if (el) {
            el.focus();
        } else {
            focus('last');
        }
    } else if (location === 'first') {
        (contentRef.value.firstElementChild as HTMLElement)?.focus();
    } else if (location === 'last') {
        (contentRef.value.lastElementChild as HTMLElement)?.focus();
    }
}

/**
 * ## onFocus
 * @param e
 */
function onFocus(e: FocusEvent) {
    if (
        !isFocused.value
        && !(e.relatedTarget && contentRef.value?.contains(e.relatedTarget as Node))
    ) {
        focus();
    }
}

/**
 * ## onFocusin
 * @param e
 */
function onFocusin(e: FocusEvent) {
    isFocused.value = true;

    if (!isOverflowing.value || !contentRef.value) {
        return;
    }

    // Focused element is likely to be the root of an item, so a
    // breadth-first search will probably find it in the first iteration
    for (const el of e.composedPath()) {
        for (const item of contentRef.value.children) {
            if (item === el) {
                scrollOffset.value = calculateUpdatedOffset({
                    selectedElement: item as HTMLElement,
                    containerSize: containerSize.value,
                    contentSize: contentSize.value,
                    isRtl: isRtl.value,
                    currentScrollOffset: scrollOffset.value,
                    isHorizontal: isHorizontal.value,
                });
                return;
            }
        }
    }
}

/**
 * ## onFocusout
 * @param e
 */
function onFocusout(e: FocusEvent) {
    isFocused.value = false;
}

/**
 * ## onKeydown
 * @param e
 */
function onKeydown(e: KeyboardEvent) {
    if (!contentRef.value) {
        return;
    }
    if (isHorizontal.value) {
        if (e.key === 'ArrowRight') {
            focus(isRtl.value ? 'previous' : 'next');
        } else if (e.key === 'ArrowLeft') {
            focus(isRtl.value ? 'next' : 'previous');
        }
    } else {
        if (e.key === 'ArrowDown') {
            focus('next');
        } else if (e.key === 'ArrowUp') {
            focus('previous');
        }
    }
    if (e.key === 'Home') {
        focus('first');
    } else if (e.key === 'End') {
        focus('last');
    }
}


/**
 * ## onScroll
 */
function onScroll() {
    if (!containerRef.value) {
        return;
    }
    containerRef.value[isHorizontal.value ? 'scrollLeft' : 'scrollTop'] = 0;
}

let startTouch = 0;
let startOffset = 0;

/**
 * ## onTouchstart
 * @param e
 */
function onTouchstart(e: TouchEvent) {
    const sizeProperty = isHorizontal.value ? 'clientX' : 'clientY';
    const sign = isRtl.value && isHorizontal.value ? -1 : 1;
    startOffset = sign * scrollOffset.value;
    startTouch = e.touches[0][sizeProperty];
    disableTransition.value = true;
}

/**
 * ## onTouchmove
 * @param e
 */
function onTouchmove(e: TouchEvent) {
    if (!isOverflowing.value) {
        return;
    }
    const sizeProperty = isHorizontal.value ? 'clientX' : 'clientY';
    const sign = isRtl.value && isHorizontal.value ? -1 : 1;
    scrollOffset.value = sign * (startOffset + startTouch - e.touches[0][sizeProperty]);
}

/**
 * # onTouchend
 * @param e
 */
function onTouchend(e: TouchEvent) {
    const maxScrollOffset = contentSize.value - containerSize.value;
    if (scrollOffset.value < 0 || !isOverflowing.value) {
        scrollOffset.value = 0;
    } else if (scrollOffset.value >= maxScrollOffset) {
        scrollOffset.value = maxScrollOffset;
    }
    disableTransition.value = false;
}


/**
 * ## scrollTo
 * @param location
 */
function scrollTo(location: 'previous' | 'next') {
    const newAbsoluteOffset = scrollOffset.value + (location === 'previous' ? -1 : 1) * containerSize.value;
    scrollOffset.value = clamp(newAbsoluteOffset, 0, contentSize.value - containerSize.value);
}


/**
 * Arrows Hidden
 */
const arrowsHiddenClasses = useDisplayRuleClasses(props, 'arrowsHidden', 'hidden');
const arrowsHiddenAttribute = computed(() => {
    return (isBoolean(props.arrowsHidden) && props.arrowsHidden);
});

const contentStyles = computed(() => {
    // This adds friction when scrolling the 'wrong' way when at max offset
    let scrollAmount = scrollOffset.value > contentSize.value - containerSize.value
        ? -(contentSize.value - containerSize.value) + bias(contentSize.value - containerSize.value - scrollOffset.value)
        : -scrollOffset.value;

    // This adds friction when scrolling the 'wrong' way when at min offset
    if (scrollOffset.value <= 0) {
        scrollAmount = bias(-scrollOffset.value);
    }

    const sign = isRtl.value && isHorizontal.value ? -1 : 1;
    return {
        transform: `translate${isHorizontal.value ? 'X' : 'Y'}(${sign * scrollAmount}px)`,
        transition: disableTransition.value ? 'none' : '',
        willChange: disableTransition.value ? 'transform' : ''
    };
});

const slotProps = computed(() => ({
    next: group.next,
    previous: group.previous,
    select: group.select,
    isSelected: group.isSelected
}));

const hasPrevious = computed(() => {
    return Math.abs(scrollOffset.value) > 0;
});

const hasNext = computed(() => {
    // Check one scroll ahead to know the width of right-most item
    return contentSize.value > Math.abs(scrollOffset.value) + containerSize.value;
});

const hasAffix = computed(() => {
    if (isBoolean(props.arrowsHidden) && props.arrowsHidden) {
        return false;
    }
    return isOverflowing.value || Math.abs(scrollOffset.value) > 0;
});

const arrowsAlignClass = computed(() => {
    return `is-arrows-${props.arrowsAlign}`;
});

const iconNext = computed(() => {
    if (props.iconNext) {
        return props.iconNext;
    }
    return isHorizontal.value ? ChevronRight : ChevronDown;
});

const iconPrevious = computed(() => {
    if (props.iconPrevious) {
        return props.iconPrevious;
    }
    return isHorizontal.value ? ChevronLeft : ChevronUp;
});

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-slide-group',
            {
                'is-overflowing': isOverflowing,
                'is-vertical': !isHorizontal
            },
            arrowsAlignClass,
            props.class
        ]"
        :style="props.style"
        :tabindex="(isFocused || group.selected.value.length) ? -1 : 0"
        @focus="onFocus"
    >
        <div
            key="container"
            ref="containerRef"
            class="ev-slide-group--container"
            @scroll="onScroll"
        >
            <div
                ref="contentRef"
                class="ev-slide-group--content"
                :style="contentStyles"
                @touchstart.passive="onTouchstart"
                @touchmove.passive="onTouchmove"
                @touchend.passive="onTouchend"
                @focusin="onFocusin"
                @focusout="onFocusout"
                @keydown="onKeydown"
            >
                <slot name="default" v-bind="slotProps" />
            </div>
        </div>

        <div
            v-if="hasAffix"
            key="previous"
            :class="[
                'ev-slide-group--previous',
                { 'is-disabled': !hasPrevious },
                ...arrowsHiddenClasses
            ]"
            :hidden="arrowsHiddenAttribute"
            @click="() => scrollTo('previous')"
        >
            <slot name="previous">
                <ev-button
                    :icon="isRtl && isHorizontal ? iconNext : iconPrevious"
                    variant="subtle"
                />
            </slot>
        </div>

        <div
            v-if="hasAffix"
            key="next"
            :class="[
                'ev-slide-group--next',
                { 'is-disabled': !hasNext },
                ...arrowsHiddenClasses
            ]"
            :hidden="arrowsHiddenAttribute"
            @click="() => scrollTo('next')"
        >
            <slot name="next">
                <ev-button
                    :icon="isRtl && isHorizontal ? iconPrevious : iconNext"
                    variant="subtle"
                />
            </slot>
        </div>
    </component>
</template>