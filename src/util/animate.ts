import {isEmpty} from "./is-functions.ts";

/**
 * # Animate
 *
 * We take advantage of the Element interface's animate() method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 *
 * @param el The element we wish to animate
 * @param keyframes The keyframes to use during animation (see the Keyframes format)
 * @param options An integer duration (in milliseconds), OR an Object containing timing properties
 */
export function animate(
    el: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions
) {
    if (typeof Animation === 'undefined' || isEmpty(el.animate)) {
        return animateFinished;
    }
    let animation: Animation;
    try {
        animation = el.animate(keyframes, options);
    } catch (e) {
        return animateFinished;
    }
    // Polyfill if `finished` is unavailable
    if (!('finished' in Animation.prototype) || isEmpty(animation.finished)) {
        (animation as any).finished = new Promise((resolve) => {
            animation.onfinish = (event) => {
                resolve(animation);
            }
        });
    }
    // Polyfill if `cancel` is unavailable
    if (!('cancel' in Animation.prototype) || isEmpty(animation.cancel)) {
        (animation as any).cancel = new Promise((resolve, reject) => {
            animation.oncancel = (event) => {
                reject(animation);
            }
        });
    }
    return animation
}

/**
 * ## Animate Finished
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
 */
export const animateFinished = {
    finished: Promise.resolve()
} as const;


/**
 * # Click Blocked Animation
 * @param el
 */
export function clickBlockedAnimation(el: HTMLElement | null | undefined) {
    if (isEmpty(el)) {
        return null;
    }
    return animate(el, [
        { transformOrigin: 'center' },
        { transform: 'scale(1.05) translateY(-3px)' },
        { transformOrigin: 'center' },
    ], {
        duration: 250,
        easing:  'cubic-bezier(0.4, 0, 0.2, 1)'
    });
}