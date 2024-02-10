import {computed, PropType, toRaw} from "vue";
import {makeAppearanceProps, propsFactory} from "@/util";
import {IconProp} from "@/composables/icons.ts";

/**
 * ## Icon Size
 */
export type IconSize = 'small'
    | 'medium'
    | 'large';

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

export const makeEvIconProps = propsFactory({
    glyph: IconProp,
    size: String as PropType<IconSize>,

    ...makeAppearanceProps()
}, 'EvIcon');