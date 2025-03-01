import { computed, PropType, toRaw } from "vue";
import { Appearance, propsFactory } from "@/util";
import { IconProp } from "@/composables/icons";

/**
 * ## Icon Size
 */
export type IconSize = "small" | "medium" | "large";

export const IconAppearance = {
    ...Appearance,
    subtle: "subtle",
} as const;

/**
 * ## Icon Appearance
 */
export type IconAppearanceProp =
    (typeof IconAppearance)[keyof typeof IconAppearance];

/**
 * # Use Icon
 * @param props
 * @param name
 */
export function useIcon(props: any, name: string) {
    return computed(() => {
        return toRaw(props[name]);
    });
}

export const makeEvIconProps = propsFactory(
    {
        glyph: IconProp,
        size: String as PropType<IconSize>,
        appearance: {
            type: String as PropType<IconAppearanceProp>,
            default: Appearance.default,
        },
    },
    "EvIcon",
);
