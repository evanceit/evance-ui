import {isElement} from "./is-functions.ts";
import {Axis} from "./dimensions.ts";

/**
 * # Get Scroll Parent
 *
 * Get the closest parent element which is scrollable.
 *
 * @param el
 * @param isIncludeHidden
 * @param axis
 */
export function getScrollParent(el: Element | null, isIncludeHidden = false, axis: Axis | null = 'y'): HTMLElement {
    while (el) {
        if (isIncludeHidden ? isScrollable(el, axis) : hasScrollbar(el, axis)) {
            return el as HTMLElement;
        }
        el = el.parentElement!;
    }
    return document.scrollingElement as HTMLElement;
}


/**
 * # Get Scroll Parents
 *
 * Get all parent elements with a scrollbar in either the x-axis, y-axis,
 * or either if `axis` is supplied as `null`.
 *
 * Defaults to y-axis, since that's the most common use-case.
 *
 * @param el
 * @param stopAt
 * @param axis
 */
export function getScrollParents(el: Element | undefined, stopAt?: Element | null, axis: Axis | null = 'y'): HTMLElement[] {
    const elements: HTMLElement[] = [];
    if (isElement(el) && isElement(stopAt) && !stopAt!.contains(el)) {
        return elements;
    }
    while (el) {
        if (hasScrollbar(el, axis)) {
            elements.push(el as HTMLElement);
        }
        if (el === stopAt) {
            break;
        }
        el = el.parentElement!;
    }
    return elements;
}


/**
 * # Has Scrollbar?
 *
 * Determine whether an Element has a Scrollbar in either the x-axis, y-axis,
 * or either if `axis` is supplied as `null`.
 *
 * This does not necessarily mean it has a scroll amount.
 *
 * Defaults to y-axis, since that's the most common use-case.
 *
 * @param el
 * @param axis
 */
export function hasScrollbar(el?: Element | null, axis: Axis | null = 'y'): boolean {
    if (!isElement(el)) {
        return false;
    }
    const style = window.getComputedStyle(el!);
    const hasScrollbarX =  style.overflowX === 'scroll' || (style.overflowX === 'auto' && el!.scrollWidth > el!.clientWidth);
    const hasScrollbarY =  style.overflowY === 'scroll' || (style.overflowY === 'auto' && el!.scrollHeight > el!.clientHeight);
    return (
        ((!axis || axis === 'x') && hasScrollbarX)
        || ((!axis || axis ==='y') && hasScrollbarY)
    );
}


/**
 * # Is Scrollable?
 *
 * Determines whether an Element is scrollable in either the x-axis, y-axis,
 * or either if `axis` is supplied as `null`.
 *
 * Defaults to y-axis, since that's the most common use-case.
 *
 * @param el
 * @param axis
 */
export function isScrollable(el: Element | null, axis: Axis | null = 'y'): boolean {
    if (!isElement(el)) {
        return false;
    }
    const style = window.getComputedStyle(el!);
    return (
        ((!axis || axis === 'x') && ['scroll', 'auto'].includes(style.overflowX))
        || ((!axis || axis === 'y') && ['scroll', 'auto'].includes(style.overflowY))
    );
}