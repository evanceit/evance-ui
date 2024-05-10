import { EvDrawerRenderer } from "@/components/EvDrawer/EvDrawerRenderer.ts";

/**
 * # EvDrawerInstance
 */
export class EvDrawerInstance {
    public constructor(private renderer: EvDrawerRenderer) {}

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
