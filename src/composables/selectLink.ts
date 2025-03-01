import { UseRouterLinkOrHref } from "@/composables/router";
import { nextTick, watch } from "vue";

/**
 * # useSelectLink
 *
 * @param link
 * @param select
 */
export function useSelectLink(
    link: UseRouterLinkOrHref,
    select?: (value: boolean, e?: Event) => void,
) {
    watch(
        () => link.isActive?.value,
        (isActive) => {
            if (link.isLink.value && isActive && select) {
                nextTick(() => {
                    select(true);
                });
            }
        },
        {
            immediate: true,
        },
    );
}
