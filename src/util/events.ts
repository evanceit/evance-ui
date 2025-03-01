import { capitalize, onScopeDispose, PropType } from "vue";
import { getScrollParents } from "./scroll";

/**
 * # Click Event Listeners
 * Standard listeners for click events.
 */
export interface ClickEventListeners {
    onClick?: EventProp | undefined;
    onClickOnce?: EventProp | undefined;
}

export type EventProp<T extends any[] = any[], F = (...args: T) => any> =
    | F
    | F[];
export const EventProp = <T extends any[] = any[]>() =>
    [Function, Array] as PropType<EventProp<T>>;

/**
 * # Call Event
 * @param eventHandler
 * @param args
 */
export function callEvent<T extends any[]>(
    eventHandler: EventProp<T> | undefined,
    ...args: T
) {
    if (Array.isArray(eventHandler)) {
        for (const handlerElement of eventHandler) {
            handlerElement(...args);
        }
    } else if (typeof eventHandler === "function") {
        eventHandler(...args);
    }
}

/**
 * # Event Name
 * @param propName
 */
export function eventName(propName: string) {
    return propName[2].toLowerCase() + propName.slice(3);
}

/**
 * # Focusable Elements
 * A list of elements we can focus on dynamically.
 */
export const focusableElements = [
    "button",
    "[href]",
    'input:not([type="hidden"])',
    "select",
    "[tabindex]",
    "textarea",
];

/**
 * # Focus Position
 */
export type FocusPosition = "next" | "previous" | "first" | "last";

/**
 * # Focus Child
 * @param el
 * @param position
 */
export function focusChild(
    el?: Element,
    position?: FocusPosition,
): HTMLElement | undefined {
    if (!el) {
        return undefined;
    }

    let focusedElement: HTMLElement | undefined;
    const focusableElements = getFocusableChildren(el);
    const index = focusableElements.indexOf(
        document.activeElement as HTMLElement,
    );

    if (!position) {
        if (
            el === document.activeElement ||
            !el.contains(document.activeElement)
        ) {
            focusedElement = focusableElements[0];
        }
    } else if (position === "first") {
        focusedElement = focusableElements[0];
    } else if (position === "last") {
        focusedElement = focusableElements.at(-1)!;
    } else {
        let lastElement;
        let lastIndex = index;
        const increment = position === "next" ? 1 : -1;
        do {
            lastIndex += increment;
            lastElement = focusableElements[lastIndex];
        } while (
            (!lastElement || lastElement.offsetParent == null) &&
            lastIndex < focusableElements.length &&
            lastIndex >= 0
        );
        if (lastElement) {
            focusedElement = lastElement;
        } else {
            return focusChild(el, position === "next" ? "first" : "last");
        }
    }
    if (focusedElement) {
        focusedElement.focus();
        return focusedElement;
    }
    return undefined;
}

/**
 * # Get Focusable Children
 *
 * Find and return any focusable elements within the supplied element,
 * unless they're disabled or have a negative `tabindex` of -1.
 *
 * @param el
 * @param filterByTabIndex
 */
export function getFocusableChildren(
    el: Element,
    filterByTabIndex = true,
): HTMLElement[] {
    const selectors = focusableElements
        .map(
            (selector) =>
                `${selector}${filterByTabIndex ? ':not([tabindex="-1"])' : ""}:not([disabled])`,
        )
        .join(", ");
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
export function hasEventListener(
    props: Record<string, any>,
    name: string,
): boolean {
    name = "on" + capitalize(name);
    return !!(
        props[name] ||
        props[`${name}Once`] ||
        props[`${name}Capture`] ||
        props[`${name}OnceCapture`] ||
        props[`${name}CaptureOnce`]
    );
}

/**
 * ## Add Scroll Event Listeners to Element (and its parents)
 * @param el
 * @param onScroll
 */
export function addScrollEventListener(
    el: HTMLElement | undefined,
    onScroll: (e: Event) => void,
) {
    const scrollElements = [document, ...getScrollParents(el)];
    scrollElements.forEach((el) => {
        el.addEventListener("scroll", onScroll, { passive: true });
    });
    onScopeDispose(() => {
        scrollElements.forEach((el) => {
            el.removeEventListener("scroll", onScroll);
        });
    });
}
