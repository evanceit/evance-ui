import { getTargetEl, ScrollStrategyData } from "../scroll";
import { addScrollEventListener } from "@/util";

/**
 * # Close Scroll Strategy
 * @param data
 */
export function closeScrollStrategy(data: ScrollStrategyData) {
    function onScroll(e: Event) {
        data.isActive.value = false;
    }
    addScrollEventListener(
        getTargetEl(data.target.value, data.contentEl.value),
        onScroll,
    );
}
