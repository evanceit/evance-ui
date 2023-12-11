import {App, ComponentPublicInstance, h, mergeProps, render, shallowRef, VNode} from "vue";
import EvDialog from "@/components/EvDialog/EvDialog.vue";
import {EvDialogInstance} from "@/components/EvDialog/EvDialogInstance.ts";
import {EvDialogServiceOptions} from "@/components/EvDialog/EvDialogService.ts";

/**
 * # EvDialogInstance
 */
export class EvDialogRenderer {
    private app: App;
    public readonly id: number;
    private instance?: ComponentPublicInstance | null;
    private container?: HTMLDivElement;
    private modelValue = shallowRef(false);
    private options: EvDialogServiceOptions;
    private promiseResolver?: (value: unknown) => void;
    private isRendered = false;

    /**
     * @param app
     * @param id
     * @param options
     */
    public constructor(app: App, id: number, options: EvDialogServiceOptions) {
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
        this.container = document.createElement('div');
        this.container.id = `ev-dialog-instance-${this.id}`;
        document.querySelector('body')!.appendChild(this.container);
    }

    /**
     * ## createProps
     * @private
     */
    private createProps() {
        const props = this.options.props ?? {};
        return mergeProps(
            props,
            {
                modelValue: this.modelValue,
                onAfterLeave: () => this.onAfterLeave(),
                __instance: new EvDialogInstance(this)
            }
        );
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
        const renderedSlots: { [key: string]: (props, slots) => VNode } = {};
        for (const key in internalSlots) {
            const component = internalSlots[key];
            renderedSlots[key] = (props, slots) => {
                return h(component, props, slots);
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
     * ## renderDialog
     * @private
     */
    public render() {
        if (this.isRendered) {
            return;
        }
        this.createContainer();
        const renderedDialog = h(
            EvDialog,
            this.createProps(),
            this.createSlots()
        );
        renderedDialog.appContext = this.app._context;
        render(renderedDialog, this.container!);
        this.instance = renderedDialog.component!.proxy!;
        this.isRendered = true;
    }
}