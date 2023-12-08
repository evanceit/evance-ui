import {propsFactory} from "@/util";
import {makeEvOverlayProps} from "@/components/EvOverlay";
import EvDialogTransition from "@/components/EvDialog/EvDialogTransition.vue";
import {Component} from "vue";

/**
 * # makeEvDialogProps
 */
export const makeEvDialogProps = propsFactory({

    fullscreen: Boolean,
    retainFocus: {
        type: Boolean,
        default: true,
    },
    scrollable: Boolean,

    ...makeEvOverlayProps({
        origin: 'center center' as const,
        scrollStrategy: 'block' as const,
        positionStrategy: 'static' as const,
        transition: {
            component: EvDialogTransition as Component
        },
        zIndex: 2400
    })

}, 'EvDialog');


export enum DialogSize {
    default = 'medium',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'x-large'
}
export type DialogSizeKey = keyof typeof DialogSize;
export type DialogSizeProp = typeof DialogSize[DialogSizeKey];
export const DialogSizeToWidth: Record<string, number> = {
    [DialogSize.small]: 400,
    [DialogSize.medium]: 600,
    [DialogSize.large]: 800,
    [DialogSize.xLarge]: 968
};