<script lang="ts">
import {propsFactory} from "@/util";
import {PropType} from "vue";

/**
 * # makeEvDialogTransitionProps
 * We could export these if we need to later, but I don't see a need for that yet.
 */
export const makeEvDialogTransitionProps = propsFactory({
    target: [Object, Array] as PropType<HTMLElement | [x: number, y: number]>,
}, 'EvDialogTransition');
</script>
<script setup lang="ts">

import {adjustedBoundingRect, animate, easingAccelerate, easingDecelerate, getTargetRect} from "@/util";

const props = defineProps(makeEvDialogTransitionProps());

/**
 * ## getDimensions
 *
 * @param target
 * @param el
 */
function getDimensions(target: HTMLElement | [x:number, y: number], el: HTMLElement) {
    const targetRect = getTargetRect(target);
    const elRect = adjustedBoundingRect(el);
    const [originX, originY] = getComputedStyle(el).transformOrigin.split(' ').map(v => parseFloat(v));
    const [anchorSide, anchorOffset] = getComputedStyle(el).getPropertyValue('--ev-overlay-position').split(' ');

    let offsetX = targetRect.left + targetRect.width / 2;
    if (anchorSide === 'left' || anchorOffset === 'left') {
        offsetX -= targetRect.width / 2;
    } else if (anchorSide === 'right' || anchorOffset === 'right') {
        offsetX += targetRect.width / 2;
    }

    let offsetY = targetRect.top + targetRect.height / 2;
    if (anchorSide === 'top' || anchorOffset === 'top') {
        offsetY -= targetRect.height / 2;
    } else if (anchorSide === 'bottom' || anchorOffset === 'bottom') {
        offsetY += targetRect.height / 2;
    }

    const tsx = targetRect.width / elRect.width;
    const tsy = targetRect.height / elRect.height;
    const maxs = Math.max(1, tsx, tsy);
    const sx = tsx / maxs || 0;
    const sy = tsy / maxs || 0;

    // Animate elements larger than 12% of the screen area up to 1.5x slower
    const asa = (elRect.width * elRect.height) / (window.innerWidth * window.innerHeight);
    const speed = asa > 0.12
        ? Math.min(1.5, (asa - 0.12) * 10 + 1)
        : 1;

    return {
        x: offsetX - (originX + elRect.left),
        y: offsetY - (originY + elRect.top),
        sx,
        sy,
        speed
    };
}

/**
 * ## onBeforeEnter
 *
 * @param el
 */
function onBeforeEnter(el: Element) {
    (el as HTMLElement).style.pointerEvents = 'none';
    (el as HTMLElement).style.visibility = 'hidden';
}

/**
 * ## onEnter
 *
 * @param el
 * @param done
 */
async function onEnter(el: Element, done: () => void) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    (el as HTMLElement).style.visibility = '';

    const {x, y, sx, sy, speed} = getDimensions(props.target!, el as HTMLElement);

    const animation = animate(el, [
        {
            transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
            opacity: 0
        },
        {},
    ], {
        duration: 225 * speed,
        easing: easingDecelerate,
    });
    animation.finished.then(() => done());
}

/**
 * ## onAfterEnter
 *
 * @param el
 */
function onAfterEnter(el: Element) {
    (el as HTMLElement).style.removeProperty('pointer-events');
}

/**
 * ## onBeforeLeave
 *
 * @param el
 */
function onBeforeLeave(el: Element) {
    (el as HTMLElement).style.pointerEvents = 'none';
}

/**
 * ## onLeave
 *
 * @param el
 * @param done
 */
async function onLeave(el: Element, done: () => void) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    const { x, y, sx, sy, speed } = getDimensions(props.target!, el as HTMLElement);
    const animation = animate(el, [
        {},
        {
            transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
            opacity: 0
        },
    ], {
        duration: 125 * speed,
        easing: easingAccelerate,
    });
    animation.finished.then(() => done());
}

/**
 * ## onAfterLeave
 *
 * @param el
 */
function onAfterLeave(el: Element) {
    (el as HTMLElement).style.removeProperty('pointer-events');
}



</script>
<template>
    <transition
        v-if="props.target"
        name="ev-dialog-transition"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
    >
        <slot />
    </transition>
    <transition
        v-else
        name="ev-dialog-transition"
    >
        <slot />
    </transition>
</template>