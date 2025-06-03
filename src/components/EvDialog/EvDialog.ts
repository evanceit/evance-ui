import { propsFactory } from "@/util";
import { EvOverlayProps, makeEvOverlayProps } from "@/components/EvOverlay";
import EvDialogTransition from "@/components/EvDialog/EvDialogTransition.vue";
import { IconProp, IconValue } from "@/composables/icons";
import { PropType, Slot, Slots } from "vue";
import { EvButtonProps } from "@/components/EvButton";
import { EvToolbarProps } from "@/components/EvToolbar";
import { EvDialogBodyProps } from "./EvDialogBody.vue";

export interface EvDialogProps extends EvOverlayProps {
    bodyProps?: EvDialogBodyProps;
    closeable?: boolean;
    draggable?: boolean;
    dragWithinViewport?: boolean;
    dragMinX?: number;
    dragMinY?: number;
    fullscreen?: boolean;
    headerActions?: EvButtonProps[];
    headerProps?: EvToolbarProps;
    hideHeader?: boolean;
    icon?: IconValue;
    noPadding?: boolean;
    retainFocus?: boolean;
    scrollable?: boolean;
    title?: string;
}

export interface EvDialogSlots extends Slots {
    container?: Slot;
    default?: Slot;
    header?: Slot;
    footer?: Slot;
}

/**
 * # makeEvDialogProps
 */
export const makeEvDialogProps = propsFactory(
    {
        bodyProps: Object as PropType<EvDialogBodyProps>,
        closeable: {
            type: Boolean,
            default: true,
        },
        draggable: Boolean,
        dragWithinViewport: {
            type: Boolean,
            default: true,
        },
        dragMinX: {
            type: Number,
            default: 0,
        },
        dragMinY: {
            type: Number,
            default: 0,
        },
        fullscreen: Boolean,
        headerActions: Array as PropType<readonly EvButtonProps[]>,
        headerProps: Object as PropType<EvToolbarProps>,
        hideHeader: Boolean,
        icon: IconProp,
        noPadding: Boolean,
        retainFocus: {
            type: Boolean,
            default: true,
        },
        scrollable: Boolean,
        title: String,

        ...makeEvOverlayProps({
            origin: "center center" as const,
            scrollStrategy: "block" as const,
            positionStrategy: "static" as const,
            transition: {
                component: EvDialogTransition,
            },
            zIndex: 2400,
        }),

        __instance: null,
    },
    "EvDialog",
);

export const DialogSize = {
    default: "medium",
    small: "small",
    medium: "medium",
    large: "large",
    xLarge: "x-large",
} as const;
export type DialogSizeProp = (typeof DialogSize)[keyof typeof DialogSize];
export const DialogSizeToWidth: Record<string, number> = {
    [DialogSize.small]: 400,
    [DialogSize.medium]: 600,
    [DialogSize.large]: 800,
    [DialogSize.xLarge]: 968,
};
