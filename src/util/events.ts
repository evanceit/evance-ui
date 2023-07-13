import {capitalize, PropType} from "vue";

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