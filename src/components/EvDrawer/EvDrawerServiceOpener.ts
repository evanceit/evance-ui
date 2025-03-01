import { App } from "vue";
import { EvDrawerRenderer } from "@/components/EvDrawer/EvDrawerRenderer";
import {
    EvDialogServiceOptions,
    EvDialogServiceProps,
    EvDialogServiceSlots,
} from "@/components/EvDialog/EvDialogServiceOpener";

export interface EvDrawerServiceOptions extends EvDialogServiceOptions {}
export interface EvDrawerServiceProps extends EvDialogServiceProps {}
export interface EvDrawerServiceSlots extends EvDialogServiceSlots {}

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
