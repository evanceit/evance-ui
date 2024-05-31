import { propsFactory } from "@/util";
import { makeEvOverlayProps } from "@/components/EvOverlay";
import EvDialogTransition from "@/components/EvDialog/EvDialogTransition.vue";

/**
 * # makeEvDialogProps
 */
export const makeEvDialogProps = propsFactory(
    {
        fullscreen: Boolean,
        retainFocus: {
            type: Boolean,
            default: true,
        },
        scrollable: Boolean,
        showHeader: {
            type: Boolean,
            default: true,
        },

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
