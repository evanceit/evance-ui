import {computed, Ref} from "vue";
import {Browser, isString} from "../util";

export type TeleportTarget = boolean | string | Element;

/**
 * # Use Teleport
 *
 * `target` where we want to teleport to.
 * `container` MUST be a CSS class selector (defaults to '.ev-teleport').
 *
 * @param target
 * @param container
 */
export function useTeleport(target: Ref<TeleportTarget>, container: string = '.ev-teleport') {
    return computed(() => {
        const targetValue = target.value;
        if (targetValue === true || !Browser.hasWindow) {
            return null;
        }

        let targetElement: HTMLElement | null;
        if (targetValue instanceof Element) {
            targetElement = targetValue as HTMLElement;
        } else if (isString(targetValue)) {
            targetElement = document.querySelector(targetValue);
        } else {
            targetElement = document.body;
        }
        if (!targetElement) {
            console.warn(`useTeleport() unable to resolve target "${targetValue}"`);
        }

        let containerElement = targetElement?.querySelector(`:scope > ${container}`);
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.className = container.substring(1);
            targetElement!.appendChild(containerElement);
        }
        return containerElement;
    });
}
