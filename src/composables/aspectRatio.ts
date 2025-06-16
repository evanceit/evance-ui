import { computed } from "vue";
import { propsFactory } from "@/util";

export type AspectRatioProps = {
    aspectRatio?: string | number;
};

export const makeAspectRatioProps = propsFactory(
    {
        aspectRatio: [String, Number],
    },
    "aspectRatio",
);

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

export function parseAspectRatio(
    value: string | number | undefined,
): number | undefined {
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        const match = value.match(/^(\d+(?:\.\d+)?)[/:](\d+(?:\.\d+)?)$/);
        if (match) {
            const [, w, h] = match;
            const ratio = parseFloat(w) / parseFloat(h);
            return isFinite(ratio) && ratio > 0 ? ratio : undefined;
        }
        const num = parseFloat(value);
        return isFinite(num) && num > 0 ? num : undefined;
    }
    return undefined;
}
