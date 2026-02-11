import { computed } from "vue";
import { Browser } from "../util";

export type TeleportTarget = boolean | string | ParentNode;

/**
 * # Use Teleport
 *
 * `target` where we want to teleport to.
 * `container` MUST be a CSS class selector (defaults to '.ev-teleport').
 *
 * @param target
 * @param container
 */
export function useTeleport(
    target: () => TeleportTarget,
    container: string = ".ev-teleport",
) {
    return computed(() => {
        const targetValue = target();
        if (targetValue === true || !Browser.hasWindow) {
            return undefined;
        }

        const targetElement =
            targetValue === false
                ? document.body
                : typeof targetValue === "string"
                  ? document.querySelector(targetValue)
                  : targetValue;

        if (!targetElement) {
            console.warn(
                `useTeleport() unable to resolve target "${targetValue}"`,
            );
        }

        let containerElement = [...targetElement.children].find((el) =>
            el.matches(container),
        );
        if (!containerElement) {
            containerElement = document.createElement("div");
            containerElement.className = container.substring(1);
            targetElement!.appendChild(containerElement);
        }
        return containerElement;
    });
}
