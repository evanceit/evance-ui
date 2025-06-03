import { App } from "vue";
import { EvDrawerRenderer } from "@/components/EvDrawer/EvDrawerRenderer";
import { EvDrawerProps, EvDrawerSlots } from "./EvDrawer";

export interface EvDrawerServiceOptions {
    props?: EvDrawerProps;
    slots?: EvDrawerSlots;
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
