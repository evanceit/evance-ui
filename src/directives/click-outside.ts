import {DirectiveBinding} from "vue";
import {isFunction, isObject, isShadowRoot} from "../util";

/**
 * ## Click Outside Args
 *
 * Allows us to accept custom arguments from v-click-outside attributes.
 * - `handler` the function to execute
 * - `condition` an optional function which determines whether the `handler` should be called.
 *              Effectively, this allows us to pause the event.
 * - `include`  an optional array of elements to include when evaluating the click outside event.
 */
interface ClickOutsideArgs {
    handler: (e: MouseEvent) => void,
    condition?: (e: Event) => boolean,
    include?: () => HTMLElement[]
}

/**
 * ## Click Outside Binding
 *
 */
interface ClickOutsideBinding extends DirectiveBinding {
    value: ((e: MouseEvent) => void) | ClickOutsideArgs
}

/**
 * # Get the actual or shadow root of an element.
 * @param el
 */
function getRoot(el: HTMLElement): null | Document | ShadowRoot {
    const root = el.getRootNode();
    if (root !== document && root.getRootNode({composed: true}) !== document) {
        return null;
    }
    return root as Document | ShadowRoot;
}

/**
 * ## Is Active?
 * Determine if the callback should be called.
 * @param e
 * @param binding
 */
function isActive(e: MouseEvent, binding: ClickOutsideBinding): boolean {
    const isActiveCallback = (isObject(binding.value) && binding.value.condition) || (() => true);
    return isActiveCallback(e);
}


/**
 * ## Is Event Outside?
 *
 * 1. Check that the event listener still wants us to trigger events (`isActive`).
 *    This helps
 *
 *
 * @param e
 * @param el
 * @param binding
 */
function isEventOutside(e: MouseEvent, el: HTMLElement, binding: ClickOutsideBinding): boolean {
    // 1 Check isActive callback
    if (!e || !isActive(e, binding)) {
        return false;
    }
    const root = getRoot(el);
    if (isShadowRoot(root) && root.host === e.target) {
        return false;
    }
    const elements = ((isObject(binding.value) && binding.value.include) || (() => []))();
    elements.push(el);
    return !elements.some(el => {
        return el?.contains(e.target as Node);
    });
}

/**
 * # On Click Handler
 *
 * @param e
 * @param el
 * @param binding
 */
function onClickHandler(e: MouseEvent, el: HTMLElement, binding: ClickOutsideBinding) {
    const handler = isFunction(binding.value) ? binding.value : binding.value.handler;
    if (!el.__clickOutside!.wasMousedownOutside || !isEventOutside(e, el, binding)) {
        return;
    }
    // setTimeout so the callback function is executed asynchronously
    setTimeout(() => {
        isActive(e, binding) && handler && handler(e);
    }, 0);
}

/**
 * ## Handle Callback
 * @param el
 * @param callback
 */
function handleCallback(el: HTMLElement, callback: Function): void {
    callback(document);
    const root = getRoot(el);
    if (isShadowRoot(root)) {
        callback(root);
    }
}

/**
 * # Click Outside Directive
 *
 * There are two handlers:
 * 1. onClick - handles click events, which are triggered after...
 * 2. onMouseDown - determines if the mouse was outside before the click event finished.
 *
 * This helps us get over an issue we had previously, where mouse dragging during a click
 * caused dialogs to close unwantedly.
 */
export const clickOutside = {

    /**
     * Add event listeners when the component is mounted.
     * @param el
     * @param binding
     */
    mounted(el: HTMLElement, binding: ClickOutsideBinding) {
        const onClick = (e: Event) => {
            onClickHandler(e as MouseEvent, el, binding);
        };
        const onMousedown = (e: Event) => {
            el.__clickOutside!.wasMousedownOutside = isEventOutside(e as MouseEvent, el, binding);
        };
        handleCallback(el, (app: HTMLElement) => {
            app.addEventListener('click', onClick, true);
            app.addEventListener('mousedown', onMousedown, true);
        });
        if (!el.__clickOutside) {
            el.__clickOutside = {
                wasMousedownOutside: false,
            };
        }
        el.__clickOutside[binding.instance!.$.uid] = { onClick, onMousedown };
    },

    /**
     * Remove event listeners when the component is unmounted.
     * @param el
     * @param binding
     */
    unmounted(el: HTMLElement, binding: ClickOutsideBinding) {
        if (!el.__clickOutside) {
            return;
        }
        handleCallback(el, (app: HTMLElement) => {
            if (!app || !el.__clickOutside?.[binding.instance!.$.uid]) {
                return;
            }
            const {onClick, onMousedown} = el.__clickOutside[binding.instance!.$.uid]!;
            app.removeEventListener('click', onClick, true);
            app.removeEventListener('mousedown', onMousedown, true);
        });
        delete el.__clickOutside[binding.instance!.$.uid];
    }
};

export default clickOutside;