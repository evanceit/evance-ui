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

export interface EvDialogController<TResult = unknown> {
    id: number;
    open: () => Promise<TResult | undefined>;
    close: (result?: TResult) => void;
    dismiss: () => void;
}

/**
 * # EvDialogService
 */
export class EvDialogServiceOpener {
    private instanceId: number = 0;

    public constructor(private app: App) {}

    public create<TResult = unknown>(
        options: EvDialogServiceOptions,
    ): EvDialogController<TResult> {
        const renderer = new EvDialogRenderer(
            this.app,
            ++this.instanceId,
            options,
        );

        return {
            id: this.instanceId,
            open: () => {
                renderer.render();
                return renderer.open() as Promise<TResult | undefined>;
            },
            close: (result?: TResult) => {
                renderer.close(result);
            },
            dismiss: () => {
                renderer.close(undefined);
            },
        };
    }

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
