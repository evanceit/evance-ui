import {EvDialogProps} from "@/components/EvDialog/EvDialog.ts";
import {App} from "vue";
import {EvDialogRenderer} from "@/components/EvDialog/EvDialogRenderer.ts";


export interface EvDialogServiceOptions {
    props?: EvDialogProps,
    slots?: EvDialogServiceSlots,
    data?: any
}

export interface EvDialogServiceSlots {
    container?: object,
    default?: object,
    header?: object,
    footer?: object
}

/**
 * # EvDialogService
 */
export class EvDialogService {
    private instanceId: number = 0;

    public constructor(
        private app: App,
    ) {}

    /**
     * ## open
     * @param options
     */
    public open(options: EvDialogServiceOptions) {
        const renderer = new EvDialogRenderer(this.app, ++this.instanceId, options);
        renderer.render();
        return renderer.open();
    }
}