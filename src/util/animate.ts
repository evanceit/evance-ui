import { isEmpty } from "./is-functions";

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
    options?: number | KeyframeAnimationOptions,
) {
    if (typeof Animation === "undefined" || isEmpty(el.animate)) {
        return animateFinished;
    }
    let animation: Animation;
    try {
        animation = el.animate(keyframes, options);
    } catch (e) {
        return animateFinished;
    }
    // Polyfill if `finished` is unavailable
    if (!("finished" in Animation.prototype) || isEmpty(animation.finished)) {
        (animation as any).finished = new Promise((resolve) => {
            animation.onfinish = () => {
                resolve(animation);
            };
        });
    }
    // Polyfill if `cancel` is unavailable
    if (!("cancel" in Animation.prototype) || isEmpty(animation.cancel)) {
        (animation as any).cancel = new Promise((resolve, reject) => {
            animation.oncancel = () => {
                reject(animation);
            };
        });
    }
    return animation;
}

/**
 * ## Animate Finished
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
 */
export const animateFinished = {
    finished: Promise.resolve(),
} as const;

/**
 * # Click Blocked Animation
 * @param el
 */
export function clickBlockedAnimation(el: HTMLElement | null | undefined) {
    if (isEmpty(el)) {
        return null;
    }
    return animate(
        el!,
        [
            { transformOrigin: "center" },
            { transform: "scale(1.05) translateY(-3px)" },
            { transformOrigin: "center" },
        ],
        {
            duration: 250,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
    );
}

let clean = true;
const frames = [] as any[];

/**
 * Schedule a task to run in an animation frame on its own
 * This is useful for heavy tasks that may cause jank if all ran together
 */
export function requestNewFrame(callback: () => void) {
    if (!clean || frames.length) {
        frames.push(callback);
        run();
    } else {
        clean = false;
        callback();
        run();
    }
}

let raf = -1;
function run() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
        const frame = frames.shift();
        if (frame) {
            frame();
        }
        if (frames.length) {
            run();
        } else {
            clean = true;
        }
    });
}

export const easingStandard = "cubic-bezier(0.4, 0, 0.2, 1)";
export const easingDecelerate = "cubic-bezier(0.0, 0, 0.2, 1)"; // Entering
export const easingAccelerate = "cubic-bezier(0.4, 0, 1, 1)"; // Leaving
