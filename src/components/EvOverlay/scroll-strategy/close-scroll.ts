import {ScrollStrategyData} from "../scroll.ts";
import {addScrollEventListener} from "../../../util";

/**
 * # Close Scroll Strategy
 * @param data
 */
export function closeScrollStrategy (data: ScrollStrategyData) {
    function onScroll (e: Event) {
        data.isActive.value = false
    }
    addScrollEventListener(data.activatorEl.value ?? data.contentEl.value, onScroll);
}