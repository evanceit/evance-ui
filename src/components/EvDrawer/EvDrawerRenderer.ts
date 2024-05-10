import {
    App,
    ComponentPublicInstance,
    h,
    mergeProps,
    render,
    shallowRef,
    VNode,
    VNodeProps,
} from "vue";
import EvDrawer from "@/components/EvDrawer/EvDrawer.vue";
import { EvDrawerInstance } from "@/components/EvDrawer/EvDrawerInstance.ts";
import {
    EvDrawerServiceOptions,
    EvDrawerServiceSlots,
} from "@/components/EvDrawer/EvDrawerServiceOpener.ts";

/**
 * # EvDrawerInstance
 */
export class EvDrawerRenderer {
    private app: App;
    public readonly id: number;
    private instance?: ComponentPublicInstance | null;
    private container?: HTMLDivElement;
    private modelValue = shallowRef(false);
    private options: EvDrawerServiceOptions;
    private promiseResolver?: (value: unknown) => void;
    private isRendered = false;

    /**
     * @param app
     * @param id
     * @param options
     */
    public constructor(app: App, id: number, options: EvDrawerServiceOptions) {
        this.app = app;
        this.id = id;
        this.options = options;
    }

    get data() {
        return this.options.data;
    }

    /**
     * ## close
     * @param response
     */
    public close(response: any) {
        this.promiseResolver?.(response);
        this.modelValue.value = false;
    }

    /**
     * ## createContainer
     * @private
     */
    private createContainer() {
        this.container = document.createElement("div");
        this.container.id = `ev-drawer-instance-${this.id}`;
        document.querySelector("body")!.appendChild(this.container);
    }

    /**
     * ## createProps
     * @private
     */
    private createProps() {
        const props = this.options.props ?? {};
        return mergeProps(props as VNodeProps, {
            modelValue: this.modelValue,
            onAfterLeave: () => this.onAfterLeave(),
            __instance: new EvDrawerInstance(this),
        });
    }

    /**
     * ## createSlots
     *
     * Convert the slots provided in the instance options
     * into render functions.
     *
     * @private
     */
    private createSlots() {
        const internalSlots = this.options.slots ?? {};
        const renderedSlots: {
            [key: string]: (props: any, slots: any) => VNode;
        } = {};
        for (const key in internalSlots) {
            const component = internalSlots[key as keyof EvDrawerServiceSlots];
            renderedSlots[key] = (props, slots) => {
                return h(component!, props, slots);
            };
        }
        return renderedSlots;
    }

    /**
     * ## onAfterLeave
     * @private
     */
    private onAfterLeave() {
        const el = this.instance!.$el.parentNode;
        render(null, el);
        el.parentNode.removeChild(el);
        this.isRendered = false;
    }

    /**
     * ## open
     */
    public open() {
        this.modelValue.value = true;
        return new Promise((resolve) => {
            this.promiseResolver = resolve;
        });
    }

    /**
     * ## render
     * @private
     */
    public render() {
        if (this.isRendered) {
            return;
        }
        this.createContainer();
        const renderedComponent = h(
            EvDrawer,
            this.createProps(),
            this.createSlots(),
        );
        renderedComponent.appContext = this.app._context;
        render(renderedComponent, this.container!);
        this.instance = renderedComponent.component!.proxy!;
        this.isRendered = true;
    }
}
