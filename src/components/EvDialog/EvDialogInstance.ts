import { EvDialogRenderer } from "@/components/EvDialog/EvDialogRenderer.ts";

/**
 * # EvDialogInstance
 */
export class EvDialogInstance {
    public constructor(private renderer: EvDialogRenderer) {}

    get data() {
        return this.renderer.data;
    }

    get id(): number {
        return this.renderer.id;
    }

    public close(response: any): void {
        this.renderer.close(response);
    }
}
