import {
    App, Component,
    ComponentPublicInstance,
    defineComponent,
    h,
    isReactive,
    render,
    shallowReactive,
    shallowRef,
    VNode,
    watch,
} from "vue";
import EvDialog from "@/components/EvDialog/EvDialog.vue";
import { EvDialogInstance } from "@/components/EvDialog/EvDialogInstance";
import {
    EvDialogServiceOptions,
    EvDialogServiceSlot,
    EvDialogServiceSlotDefinition,
} from "./EvDialogServiceOpener";
import { EvDialogSlots } from "./EvDialog";

/**
 * # EvDialogInstance
 */
export class EvDialogRenderer {
    private app: App;
    public readonly id: number;
    private hostInstance?: ComponentPublicInstance | null;
    private container?: HTMLDivElement;
    private modelValue = shallowRef(false);
    public readonly options: EvDialogServiceOptions;
    private promiseResolver?: (value: unknown) => void;
    private isRendered = false;
    private isClosed = false;

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
    public close(response?: unknown) {
        if (this.isClosed) {
            return;
        }
        this.isClosed = true;
        this.promiseResolver?.(response);
        this.promiseResolver = undefined;
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
        const renderedSlots: Record<string, (scope: any) => VNode> = {};

        for (const key in internalSlots) {
            const slot = internalSlots[key as keyof EvDialogSlots];
            if (!slot) continue;
            const { component, props } = this.normaliseSlot(slot);

            // Keep one reactive object for the renderer's lifetime so updates
            // flow through without remounting the slot (no form resets).
            const slotProps = props
                ? isReactive(props)
                    ? props
                    : shallowReactive(props)
                : undefined;

            renderedSlots[key] = (scope) =>
                h(component, { ...slotProps, ...scope });
        }
        return renderedSlots;
    }

    private normaliseSlot(
        slot: EvDialogServiceSlot,
    ): EvDialogServiceSlotDefinition {
        // Component option objects can have a `props` key themselves,
        // so discriminate on `component`, not `props`.
        if (typeof slot === "object" && slot !== null && "component" in slot) {
            return slot as EvDialogServiceSlotDefinition;
        }
        return { component: slot as Component };
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
        this.isRendered = true;
    }
}
