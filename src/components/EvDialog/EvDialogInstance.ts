import { EvDialogRenderer } from "@/components/EvDialog/EvDialogRenderer";
import { EvDialogProps } from "@/components/EvDialog";

/**
 * # EvDialogInstance
 */
export class EvDialogInstance {
    public constructor(private renderer: EvDialogRenderer) {}

    get data() {
        return this.renderer.options.data;
    }

    get props(): EvDialogProps {
        return this.renderer.options.props;
    }

    get id(): number {
        return this.renderer.id;
    }

    public close(response: any): void {
        this.renderer.close(response);
    }
}
