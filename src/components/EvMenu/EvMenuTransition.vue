<script setup lang="ts">
/**
 * # EvMenu Transition
 *
 * We use JavaScript hooks to animate the menu.
 *
 * @see https://vuejs.org/guide/built-ins/transition.html#javascript-hooks
 */
import {computed, PropType, useSlots} from "vue";
import {animate, easingAccelerate, easingDecelerate, easingStandard, Rect} from "../../util";

const props = defineProps({
    target: Object as PropType<HTMLElement>
});

// Transition will only have one default slot.
const slots = useSlots();


/**
 * ## Get Children
 *
 * We're only interested in animating the following children:
 *
 * - `ev-surface`
 * - `ev-card`
 * - `ev-list`
 *
 * @param el
 */
function getChildren (el: Element) {
    const els = el.querySelector(':scope > .ev-card, :scope > .ev-surface, :scope > .ev-list')?.children;
    return els && [...els];
}


/**
 * ## Get Dimensions
 * @param target
 * @param el
 */
function getDimensions(target: HTMLElement, el: HTMLElement) {
    const targetBox = Rect.fromElement(target);
    const elBox = Rect.fromElement(el, true);
    const elStyle = getComputedStyle(el);
    const [originX, originY] = elStyle.transformOrigin.split(' ').map(v => parseFloat(v));
    const [anchorSide, anchorOffset] = elStyle.getPropertyValue('--ev-overlay-position').split(' ');

    let offsetX = targetBox.left;
    if (anchorSide === 'center' || anchorOffset === 'center') {
        offsetX += targetBox.width / 2;
    } else if (anchorSide === 'right' || anchorOffset === 'right') {
        offsetX += targetBox.width;
    }

    let offsetY = targetBox.top;
    if (anchorSide === 'center' || anchorOffset === 'center') {
        offsetY += targetBox.height / 2;
    } else if (anchorSide === 'bottom' || anchorOffset === 'bottom') {
        offsetY += targetBox.height;
    }

    const targetScaleX = targetBox.width / elBox.width;
    const targetScaleY = targetBox.height / elBox.height;
    const maxScale = Math.max(1, targetScaleX, targetScaleY);
    const scaleX =  targetScaleX / maxScale || 0;
    const scaleY =  targetScaleY / maxScale || 0;

    // Animate elements larger than 12% of the screen area up to 1.5x slower
    const screenPercentage = (elBox.width * elBox.height) / (window.innerWidth * window.innerHeight);
    const speedFactor = (screenPercentage > 0.12) ? Math.min(1.5, (screenPercentage - 0.12) * 10 + 1) : 1;

    return {
        x: offsetX - (originX + elBox.left),
        y: offsetY - (originY + elBox.top),
        scaleX,
        scaleY,
        speedFactor
    };
}


/**
 * ## On Before Enter
 *
 * Before the element is inserted into the DOM.
 *
 * @param el
 */
function onBeforeEnter(el: Element) {
    (el as HTMLElement).style.pointerEvents = 'none';
    (el as HTMLElement).style.visibility = 'hidden';
}


/**
 * ## On Enter
 *
 * Called one frame after the element is inserted.
 *
 * @param el
 * @param done
 */
async function onEnter(el: Element, done: () => void) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    (el as HTMLElement).style.visibility = '';
    const { x, y, scaleX, scaleY, speedFactor } = getDimensions(props.target!, el as HTMLElement);
    const duration = 250;

    const animation = animate(el, [
        {
            transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`,
            opacity: 0
        },
        {},
    ], {
        duration: duration * speedFactor,
        easing: easingStandard
    });
    getChildren(el)?.forEach(el => {
        animate(el, [
            { opacity: 0 },
            { opacity: 0, offset: 0.25 },
            {},
        ], {
            duration: duration * speedFactor,
            easing: easingStandard
        });
    })
    animation.finished.then(() => done());
}


/**
 * ## On After Enter
 *
 * Called when the enter transition has finished.
 *
 * @param el
 */
function onAfterEnter(el: Element) {
    (el as HTMLElement).style.removeProperty('pointer-events');
}


/**
 * ## On Before Leave
 *
 * Called before the leave hook.
 *
 * @param el
 */
function onBeforeLeave(el: Element) {
    (el as HTMLElement).style.pointerEvents = 'none';
}


/**
 * ## On Leave
 *
 * Called when the leave transition starts.
 *
 * @param el
 * @param done
 */
async function onLeave(el: Element, done: () => void) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    const { x, y, scaleX, scaleY, speedFactor } = getDimensions(props.target!, el as HTMLElement);

    const animation = animate(el, [
        {},
        {
            transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`,
            opacity: 0
        }
    ], {
        duration: 125 * speedFactor,
        easing: easingAccelerate
    })
    animation.finished.then(() => done());

    getChildren(el)?.forEach(el => {
        animate(el, [
            {},
            { opacity: 0, offset: 0.25 },
            { opacity: 0 },
        ], {
            duration: 250 * speedFactor,
            easing: easingStandard
        })
    });
}


/**
 * ## On After Leave
 *
 * Called when the leave transition has finished and the element has been removed from the DOM.
 *
 * @param el
 */
function onAfterLeave(el: Element) {
    (el as HTMLElement).style.removeProperty('pointer-events');
}


/**
 * Calculate transition props so we can use v-bind.
 */
const transitionProps = computed(() => {
   return (props.target) ? {
           css: false,
           onBeforeEnter,
           onEnter,
           onAfterEnter,
           onBeforeLeave,
           onLeave,
           onAfterLeave
       } : {};
});

</script>
<template>
    <transition
        name="ev-menu-transition"
        v-bind="transitionProps"
    >
        <slot />
    </transition>
</template>