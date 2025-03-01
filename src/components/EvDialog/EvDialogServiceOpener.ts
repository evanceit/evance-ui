import { App } from "vue";
import { EvDialogRenderer } from "@/components/EvDialog/EvDialogRenderer";

export interface EvDialogServiceOptions {
    props?: EvDialogServiceProps;
    slots?: EvDialogServiceSlots;
    data?: any;
}

/**
 * # EvDialogProps
 */
export interface EvDialogServiceProps {
    width?: number | string;
    veil?: boolean;
    showHeader?: boolean;
    retainFocus?: boolean;
    persistent?: boolean;
}

export interface EvDialogServiceSlots {
    container?: object;
    default?: object;
    header?: object;
    footer?: object;
}

/**
 * # EvDialogService
 */
export class EvDialogServiceOpener {
    private instanceId: number = 0;

    public constructor(private app: App) {}

    /**
     * ## open
     * @param options
     */
    public open(options: EvDialogServiceOptions) {
        const renderer = new EvDialogRenderer(
            this.app,
            ++this.instanceId,
            options,
        );
        renderer.render();
        return renderer.open();
    }
}
