import { computed } from "vue";
import { propsFactory } from "@/util";
import { makeComponentProps } from "@/composables/component";
import { makeDimensionsProps } from "@/composables/dimensions";

export type EvResponsiveSlots = {
    default: never;
    content: never;
};

export type AspectRatioProps = {
    aspectRatio?: string | number;
};

/**
 * # useAspectStyles
 *
 * Aspect ratio notation is permitted as a number or a string where aspects such as '16:9' is
 * converted to a division '16/9'.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
 * @param props
 */
export function useAspectStyles(props: AspectRatioProps) {
    return {
        aspectStyles: computed(() => {
            if (!props.aspectRatio) {
                return undefined;
            }
            const ratio = String(props.aspectRatio);
            return {
                aspectRatio: ratio.replace(":", "/"),
            };
        }),
    };
}

export const makeEvResponsiveProps = propsFactory(
    {
        aspectRatio: [String, Number],
        contentClass: String,
        inline: Boolean,

        ...makeComponentProps(),
        ...makeDimensionsProps(),
    },
    "EvResponsive",
);
