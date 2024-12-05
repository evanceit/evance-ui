import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Browser } from "@/util";

export function useIntersectionObserver(
    callback?: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
) {
    const intersectionRef = ref<HTMLElement>();
    const isIntersecting = shallowRef(false);

    if (Browser.supportsIntersection) {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                callback?.(entries, observer);
                isIntersecting.value = !!entries.find((entry) => {
                    /**
                     * There is a bug somewhere resulting in stale entries.
                     * Make sure we're checking `entry.isIntersecting` on the correct entry
                     * based on current position within a tolerance.
                     */
                    const tolerance = 1e-4;
                    const currentRect = entry.target.getBoundingClientRect();
                    const entryRect = entry.boundingClientRect;
                    return (
                        entry.isIntersecting &&
                        Math.abs(currentRect.top - entryRect.top) < tolerance &&
                        Math.abs(currentRect.left - entryRect.left) < tolerance
                    );
                });
            },
            options,
        );

        onBeforeUnmount(() => {
            observer.disconnect();
        });

        watch(
            intersectionRef,
            (newValue, oldValue) => {
                if (oldValue) {
                    observer.unobserve(oldValue);
                    isIntersecting.value = false;
                }
                if (newValue) {
                    observer.observe(newValue);
                }
            },
            {
                flush: "post",
            },
        );
    }

    return { intersectionRef, isIntersecting };
}
