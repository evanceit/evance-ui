import { onBeforeUnmount, readonly, ref, watch } from "vue";
import type { DeepReadonly, Ref } from "vue";
import { Browser, refElement } from "../util";

interface ResizeState {
    resizeRef: Ref<HTMLElement | undefined>;
    contentRect: DeepReadonly<Ref<DOMRectReadOnly | undefined>>;
}

/**
 * # Resize Observer
 * @param callback
 * @param box
 */
export function useResizeObserver(
    callback?: ResizeObserverCallback,
    box: "content" | "border" = "content",
): ResizeState {
    const resizeRef = ref<HTMLElement>();
    const contentRect = ref<DOMRectReadOnly>();

    if (Browser.hasWindow) {
        const observer = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                callback?.(entries, observer);
                if (!entries.length) {
                    return;
                }
                if (box === "content") {
                    contentRect.value = entries[0].contentRect;
                } else {
                    contentRect.value =
                        entries[0].target.getBoundingClientRect();
                }
            },
        );

        onBeforeUnmount(() => {
            observer.disconnect();
        });

        watch(
            resizeRef,
            (newValue, oldValue) => {
                if (oldValue) {
                    observer.unobserve(refElement(oldValue));
                    contentRect.value = undefined;
                }

                if (newValue) {
                    observer.observe(refElement(newValue));
                }
            },
            {
                flush: "post",
            },
        );
    }

    return {
        resizeRef,
        contentRect: readonly(contentRect),
    };
}
