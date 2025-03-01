import { ScrollStrategyData, ScrollStrategyProps } from "../scroll";
import { EffectScope, onScopeDispose } from "vue";
import { addScrollEventListener, requestNewFrame } from "@/util";

/**
 * # Reposition Scroll Strategy
 * @param data
 * @param props
 * @param scope
 */
export function repositionScrollStrategy(
    data: ScrollStrategyData,
    props: ScrollStrategyProps,
    scope: EffectScope,
) {
    let slow = false;
    let raf = -1;
    let ric = -1;

    function update(e: Event) {
        requestNewFrame(() => {
            const start = performance.now();
            data.updatePosition.value?.(e);
            const time = performance.now() - start;
            slow = time / (1000 / 60) > 2;
        });
    }

    ric = (
        typeof requestIdleCallback === "undefined"
            ? (cb: Function) => cb()
            : requestIdleCallback
    )(() => {
        scope.run(() => {
            addScrollEventListener(
                data.activatorEl.value ?? data.contentEl.value,
                (e) => {
                    if (slow) {
                        // If the position calculation is slow,
                        // defer updates until scrolling is finished.
                        // Browsers usually fire one scroll event per frame so
                        // we just wait until we've got two frames without an event
                        cancelAnimationFrame(raf);
                        raf = requestAnimationFrame(() => {
                            raf = requestAnimationFrame(() => {
                                update(e);
                            });
                        });
                    } else {
                        update(e);
                    }
                },
            );
        });
    });

    onScopeDispose(() => {
        typeof cancelIdleCallback !== "undefined" && cancelIdleCallback(ric);
        cancelAnimationFrame(raf);
    });
}
