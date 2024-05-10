import { propsFactory, toWebUnit } from "../util";
import { computed } from "vue";

/**
 * # Dimensions Props
 */
export interface DimensionsProps {
    height?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
    width?: number | string;
}

/**
 * # Make Dimensions Props
 */
export const makeDimensionsProps = propsFactory(
    {
        height: [Number, String],
        maxHeight: [Number, String],
        maxWidth: [Number, String],
        minHeight: [Number, String],
        minWidth: [Number, String],
        width: [Number, String],
    },
    "dimensions",
);

/**
 * # Use Dimensions
 * @param props
 */
export function useDimensions(props: DimensionsProps) {
    return computed(() => ({
        height: toWebUnit(props.height),
        maxHeight: toWebUnit(props.maxHeight),
        maxWidth: toWebUnit(props.maxWidth),
        minHeight: toWebUnit(props.minHeight),
        minWidth: toWebUnit(props.minWidth),
        width: toWebUnit(props.width),
    }));
}
