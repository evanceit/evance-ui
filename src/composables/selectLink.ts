import { UseRouterLinkOrHref } from "@/composables/router";
import { computed, nextTick, watch } from "vue";

/**
 * # useSelectLink
 *
 * @param link
 * @param select
 * @param exact
 */
export function useSelectLink(
    link: UseRouterLinkOrHref,
    select?: (value: boolean, e?: Event) => void,
    exact = false,
) {
    const isSelected = computed(() => {
        return exact ? link.isExactActive?.value : link.isActive?.value;
    });
    watch(
        isSelected,
        (isActive) => {
            if (link.isLink.value && select && isActive) {
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
