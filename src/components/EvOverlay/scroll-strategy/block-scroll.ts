import { ScrollStrategyData, ScrollStrategyProps } from "../scroll.ts";
import { getScrollParents, hasScrollbar, toWebUnit } from "@/util";
import { onScopeDispose } from "vue";

/**
 * # Block Scroll Strategy
 * @param data
 * @param props
 */
export function blockScrollStrategy(
    data: ScrollStrategyData,
    props: ScrollStrategyProps,
) {
    const offsetParent = data.containerEl.value?.offsetParent;
    const scrollElements = [
        ...new Set([
            ...getScrollParents(
                data.activatorEl.value,
                props.contained ? offsetParent : undefined,
            ),
            ...getScrollParents(
                data.contentEl.value,
                props.contained ? offsetParent : undefined,
            ),
        ]),
    ].filter((el) => !el.classList.contains("ev-overlay-scroll-blocked"));
    const scrollbarWidth =
        window.innerWidth - document.documentElement.offsetWidth;
    const scrollableParent = ((el) => hasScrollbar(el) && el)(
        offsetParent || document.documentElement,
    );
    if (scrollableParent) {
        data.containerEl.value?.classList.add("ev-overlay--scroll-blocked");
    }

    scrollElements.forEach((el, i) => {
        el.style.setProperty(
            "--ev-body-scroll-x",
            toWebUnit(-el.scrollLeft) ?? null,
        );
        el.style.setProperty(
            "--ev-body-scroll-y",
            toWebUnit(-el.scrollTop) ?? null,
        );
        if (el !== document.documentElement) {
            el.style.setProperty(
                "--ev-scrollbar-offset",
                toWebUnit(scrollbarWidth) ?? null,
            );
        }
        el.classList.add("ev-overlay-scroll-blocked");
    });

    onScopeDispose(() => {
        scrollElements.forEach((el, i) => {
            const x = parseFloat(
                el.style.getPropertyValue("--ev-body-scroll-x"),
            );
            const y = parseFloat(
                el.style.getPropertyValue("--ev-body-scroll-y"),
            );

            el.style.removeProperty("--ev-body-scroll-x");
            el.style.removeProperty("--ev-body-scroll-y");
            el.style.removeProperty("--ev-scrollbar-offset");
            el.classList.remove("ev-overlay-scroll-blocked");
            el.scrollLeft = -x;
            el.scrollTop = -y;
        });
        if (scrollableParent) {
            data.containerEl.value?.classList.remove(
                "ev-overlay--scroll-blocked",
            );
        }
    });
}
