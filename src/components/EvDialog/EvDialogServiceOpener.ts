import { EvDialogRenderer } from "@/components/EvDialog/EvDialogRenderer";
import { EvDialogProps, EvDialogSlots } from "./EvDialog";
import { App, Component } from "vue";

export interface EvDialogServiceSlots
    extends Partial<Record<keyof EvDialogSlots, Component>> {}

export interface EvDialogServiceOptions {
    props?: EvDialogProps;
    slots?: EvDialogServiceSlots;
    data?: any;
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
