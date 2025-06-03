import { App, Component } from "vue";
import { EvDrawerRenderer } from "@/components/EvDrawer/EvDrawerRenderer";
import { EvDrawerProps, EvDrawerSlots } from "./EvDrawer";

export interface EvDrawerServiceSlots
    extends Partial<Record<keyof EvDrawerSlots, Component>> {}

export interface EvDrawerServiceOptions {
    props?: EvDrawerProps;
    slots?: EvDrawerServiceSlots;
    data?: any;
}

/**
 * # EvDrawerServiceOpener
 */
export class EvDrawerServiceOpener {
    private instanceId: number = 0;

    public constructor(private app: App) {}

    /**
     * ## open
     * @param options
     */
    public open(options: EvDrawerServiceOptions) {
        const renderer = new EvDrawerRenderer(
            this.app,
            ++this.instanceId,
            options,
        );
        renderer.render();
        return renderer.open();
    }
}
