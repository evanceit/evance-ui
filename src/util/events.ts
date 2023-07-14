import {capitalize, PropType} from "vue";
import {isArray} from "./is-functions.ts";

/**
 * # Click Event Listeners
 * Standard listeners for click events.
 */
export interface ClickEventListeners {
    onClick?: EventProp | undefined;
    onClickOnce?: EventProp | undefined;
}

export type EventProp<T extends any[] = any[], F = (...args: T) => any> = F | F[];

export const EventProp = <T extends any[] = any[]>() => [Function, Array] as PropType<EventProp<T>>;


/**
 * # Call Event
 * @param eventHandler
 * @param args
 */
export function callEvent<T extends any[]>(eventHandler: EventProp<T> | undefined, ...args: T) {
    if (isArray(eventHandler)) {
        for (const handlerElement of eventHandler) {
            handlerElement(...args);
        }
    } else if (typeof eventHandler === 'function') {
        eventHandler(...args)
    }
}


/**
 * # Focusable Elements
 * A list of elements we can focus on dynamically.
 */
export const focusableElements = [
    'button',
    '[href]',
    'input:not([type="hidden"])',
    'select',
    '[tabindex]',
    'textarea'
];


/**
 * # Focus Position
 */
export type FocusPosition = 'next' | 'previous' | 'first' | 'last';


/**
 * # Focus Child
 * @param el
 * @param position
 */
export function focusChild(el?: Element, position?: FocusPosition) {
    if (!el) {
        return;
    }
    const focusableElements = getFocusableChildren(el);
    console.log(focusableElements);
    const index = focusableElements.indexOf(document.activeElement as HTMLElement)
    if (!position) {
        if (el === document.activeElement || !el.contains(document.activeElement)) {
            focusableElements[0]?.focus();
        }
    } else if (position === 'first') {
        focusableElements[0]?.focus();
    } else if (position === 'last') {
        focusableElements.at(-1)?.focus();
    } else {
        let focusableElement;
        let lastIndex = index;
        const increment = (position === 'next') ? 1 : -1;
        do {
            lastIndex += increment;
            focusableElement = focusableElements[lastIndex];
        } while (
            (!focusableElement || focusableElement.offsetParent == null)
            && (lastIndex < focusableElements.length)
            && (lastIndex >= 0)
            );
        if (focusableElement) {
            focusableElement.focus();
        } else {
            focusChild(el, position === 'next' ? 'first' : 'last');
        }
    }
}


/**
 * # Get Focusable Children
 *
 * Find and return any focusable elements within the supplied element,
 * unless they're disabled or have a negative `tabindex` of -1.
 *
 * @param el
 */
export function getFocusableChildren(el: Element): HTMLElement[] {
    const selectors = focusableElements
        .map(selector => `${selector}:not([disabled]):not([tabindex="-1"])`)
        .join(', ')
    return [...el.querySelectorAll(selectors)] as HTMLElement[];
}


/**
 * # Has Event Listener
 *
 * Determines whether the `props` supplied includes an event listener, or
 * any variations of the event listener. For example, 'click' events may have:
 * - 'onClick'
 * - 'onClickOnce'
 * - 'onClickOnceCapture'
 * - 'onClickCaptureOnce'
 *
 * @param props
 * @param name
 */
export function hasEventListener(props: Record<string, any>, name: string): boolean {
    name = 'on' + capitalize(name);
    return !!(
        props[name]
        || props[`${name}Once`]
        || props[`${name}Capture`]
        || props[`${name}OnceCapture`]
        || props[`${name}CaptureOnce`]
    );
}