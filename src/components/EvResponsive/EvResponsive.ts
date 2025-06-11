import { propsFactory } from "@/util";
import { ComponentProps, makeComponentProps } from "@/composables/component";
import { DimensionsProps, makeDimensionsProps } from "@/composables/dimensions";
import {
    AspectRatioProps,
    makeAspectRatioProps,
} from "@/composables/aspectRatio";

export type EvResponsiveSlots = {
    default: never;
    content: never;
};

export interface EvResponsiveProps
    extends AspectRatioProps,
        DimensionsProps,
        ComponentProps {
    contentClass?: string;
    inline?: boolean;
}

export const makeEvResponsiveProps = propsFactory(
    {
        contentClass: String,
        inline: {
            type: Boolean,
            default: undefined,
            required: false,
        },

        ...makeAspectRatioProps(),
        ...makeComponentProps(),
        ...makeDimensionsProps(),
    },
    "EvResponsive",
);
