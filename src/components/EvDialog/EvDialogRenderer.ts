import {
    App,
    ComponentPublicInstance, defineComponent,
    h,
    isReactive,
    render,
    shallowReactive,
    shallowRef,
    VNode,
    VNodeProps,
    watch,
} from "vue";
import EvDialog from "@/components/EvDialog/EvDialog.vue";
import { EvDialogInstance } from "@/components/EvDialog/EvDialogInstance";
import { EvDialogServiceOptions } from "./EvDialogServiceOpener";
import { EvDialogSlots } from "./EvDialog";

/**
 * # EvDialogInstance
 */
export class EvDialogRenderer {
    private app: App;
    public readonly id: number;
    private instance?: ComponentPublicInstance | null;
    private hostInstance?: ComponentPublicInstance | null;
    private container?: HTMLDivElement;
    private modelValue = shallowRef(false);
    public readonly options: EvDialogServiceOptions;
    private promiseResolver?: (value: unknown) => void;
    private isRendered = false;

    private dialogInstance = new EvDialogInstance(this);

    private readonly props = shallowReactive<Record<string, any>>({});

    // Keep the same slots object for the lifetime of this renderer.
    private readonly slots: {
        [key: string]: (props: any, slots: any) => VNode;
    };

    /**
     * @param app
     * @param id
     * @param options
     */
    public constructor(app: App, id: number, options: EvDialogServiceOptions) {
        this.app = app;
        this.id = id;
        const incomingProps = options.props ?? {};
        this.options = {
            ...options,
            props: isReactive(incomingProps)
                ? incomingProps
                : shallowReactive(incomingProps),
        };
        this.slots = this.createSlots();
        this.createProps();
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
        this.container.id = `ev-dialog-instance-${this.id}`;
        document.querySelector("body")!.appendChild(this.container);
    }

    /**
     * ## createProps
     *
     * Initializes a stable reactive props object that EvDialog binds to.
     * We then mutate this object when caller props / internal state changes,
     * without re-rendering the vnode tree (prevents form resets).
     *
     * @private
     */
    private createProps() {
        const userProps = this.options.props ?? {};
        Object.assign(this.props, userProps);

        // Internal props (these should be respected over user props)
        this.props.modelValue = this.modelValue;
        this.props["onUpdate:modelValue"] = (v: boolean) => (this.modelValue.value = v);
        this.props.onAfterLeave = () => this.onAfterLeave();
        this.props.__instance = this.dialogInstance;

        // If the caller gave us a reactive props object, sync changes into hostProps
        // (deep watch so nested props updates flow too)
        if (this.options.props && isReactive(this.options.props)) {
            watch(
                this.options.props as any,
                () => {
                    // Copy latest user props onto props
                    Object.assign(this.props, this.options.props as any);
                    // Re-assert internal props so the user can't override them
                    this.props.modelValue = this.modelValue;
                    this.props["onUpdate:modelValue"] = (v: boolean) => (this.modelValue.value = v);
                    this.props.onAfterLeave = () => this.onAfterLeave();
                    this.props.__instance = this.dialogInstance;
                },
                { deep: true },
            );
        }
    }

    /**
     * ## createSlots
     *
     * Convert the slots provided in the instance options
     * into render functions.
     *
     * IMPORTANT: This must be created ONCE and reused to avoid remounting
     * slot content and losing internal form state.
     *
     * @private
     */
    private createSlots() {
        const internalSlots = this.options.slots ?? {};
        const renderedSlots: {
            [key: string]: (props: any, slots: any) => VNode;
        } = {};
        for (const key in internalSlots) {
            const component = internalSlots[key as keyof EvDialogSlots];
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
        const el = this.hostInstance?.$el ?? this.container;
        if (!el) return;
        render(null, this.container!);
        this.container!.remove();
        this.isRendered = false;
        this.hostInstance = null;
        this.instance = null;
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

        const host = defineComponent({
            name: "EvDialogHost",
            setup: () => () => h(EvDialog, this.props, this.slots),
        });

        const vnode = h(host);
        vnode.appContext = this.app._context;
        render(vnode, this.container!);

        this.hostInstance = vnode.component?.proxy ?? null;

        const subTree = vnode.component?.subTree;
        this.instance = subTree?.component?.proxy ?? null;
        this.isRendered = true;
    }
}
