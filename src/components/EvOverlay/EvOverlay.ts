import { propsFactory } from "@/util";
import { PropType, Ref } from "vue";
import { TeleportTarget } from "@/composables/teleport";
import { DimensionsProps, makeDimensionsProps } from "@/composables/dimensions";
import { ActivatorProps, makeActivatorProps } from "./activator";
import { makePositionStrategyProps, PositionStrategyProps } from "./position";
import { makeScrollStrategyProps, ScrollStrategyProps } from "./scroll";
import {
    EvTransitionProps,
    makeEvTransitionProps,
} from "@/components/EvTransition";
import { ComponentProps, makeComponentProps } from "@/composables/component";

type ModelValueProp = boolean | Ref<boolean>;

export interface EvOverlayProps
    extends ActivatorProps,
        DimensionsProps,
        PositionStrategyProps,
        ScrollStrategyProps,
        EvTransitionProps,
        ComponentProps {
    absolute?: boolean;
    attach?: TeleportTarget;
    closeOnBack?: boolean;
    contained?: boolean;
    contentClass?: string;
    contentProps?: Record<string, unknown>;
    disabled?: boolean;
    modelValue?: ModelValueProp;
    persistent?: boolean;
    veil?: boolean;
    zIndex?: number | string;
}

/**
 * # Make EvOverlay Props
 */
export const makeEvOverlayProps = propsFactory(
    {
        absolute: Boolean,
        attach: [Boolean, String, Object] as PropType<TeleportTarget>,
        closeOnBack: {
            type: Boolean,
            default: true,
        },
        contained: Boolean,
        contentClass: String,
        contentProps: Object as PropType<EvOverlayProps["contentProps"]>,
        disabled: Boolean,
        modelValue: [Boolean, Object] as PropType<ModelValueProp>,
        persistent: Boolean,
        veil: {
            type: Boolean,
            default: true,
        },
        zIndex: {
            type: [Number, String],
            default: 2000,
        },

        ...makeActivatorProps(),
        ...makeDimensionsProps(),
        ...makePositionStrategyProps(),
        ...makeScrollStrategyProps(),
        ...makeEvTransitionProps(),
        ...makeComponentProps(),
    },
    "EvOverlay",
);


