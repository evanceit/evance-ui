import {DelayOpenCloseProps, makeDelayOpenCloseProps, useDelayOpenClose} from "../../composables/delay.ts";
import {
    ComponentInternalInstance,
    ComponentPublicInstance,
    computed,
    ComputedRef, effectScope, EffectScope,
    inject, mergeProps,
    nextTick, onScopeDispose,
    PropType,
    ref,
    Ref,
    watch,
    watchEffect
} from "vue";
import {bindProps, Browser, getCurrentComponent, propsFactory, refElement, unbindProps} from "../../util";
import {FocusEvent} from "react";
import {EvMenuSymbol} from "../EvMenu";
import {a} from "@storybook/vue3/dist/render-c842c5d5";


export interface ActivatorProps extends DelayOpenCloseProps {
    activator?: 'parent' | string | Element | ComponentPublicInstance;
    openOnClick: boolean | undefined;
    openOnHover: boolean;
    openOnFocus: boolean | undefined;
    closeOnContentClick: boolean;
}

export const makeActivatorProps = propsFactory({
    activator: [String, Object] as PropType<ActivatorProps['activator']>,
    openOnClick: {
        type: Boolean,
        default: undefined
    },
    openOnHover: Boolean,
    openOnFocus: {
        type: Boolean,
        default: undefined
    },
    closeOnContentClick: Boolean,

    ...makeDelayOpenCloseProps()
}, 'EvOverlay/activator');



interface ActivatorEvents {
    onBlur?: (e: FocusEvent) => void;
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onMouseenter?: (e: MouseEvent) => void;
    onMouseleave?: (e: MouseEvent) => void;
}

interface ContentEvents {
    onMouseenter?: () => void;
    onMouseleave?: () => void;
    onFocusin?: () => void;
    onFocusout?: () => void;
    onClick?: () => void;
}

interface VeilEvents {
    onMouseenter?: () => void;
    onMouseleave?: () => void;
}

/**
 * # Use Activator
 *
 * @param props
 * @param isActive
 * @param isTopOfStack
 */
export function useActivator(
    props: ActivatorProps,
    isActive: Ref<boolean>,
    isTopOfStack: Ref<boolean>
) {
    return new Activator(props, isActive, isTopOfStack);
}

class Activator {
    public readonly activatorEl = ref<HTMLElement>();
    public readonly activatorEvents: ComputedRef<Partial<ActivatorEvents>>;
    public readonly activatorRef = ref();
    public readonly availableEvents: ActivatorEvents;
    public readonly component: ComponentInternalInstance;
    public readonly contentEvents: ComputedRef<Partial<ContentEvents>>;
    public readonly delayClose: Promise<boolean>;
    public readonly delayOpen: Promise<boolean>;
    public readonly openOnClick: ComputedRef<boolean>;
    public readonly openOnFocus: ComputedRef<boolean>;
    public readonly veilEvents: ComputedRef<Partial<VeilEvents>>;

    public isHovered = false;
    public isFocused = false;
    public firstEnter = true;

    constructor(
        public props: ActivatorProps,
        public isActive: Ref<boolean>,
        public isTopOfStack: Ref<boolean>
    ) {
        this.component = getCurrentComponent('Activator');
        this.openOnFocus = computed(() => props.openOnFocus || (props.openOnFocus == null && props.openOnHover));
        this.openOnClick = computed(() => props.openOnClick || (props.openOnClick == null && !props.openOnHover && !this.openOnFocus.value));
        const { delayOpen, delayClose } = this.createDelayFunctions();
        this.delayOpen = delayOpen;
        this.delayClose = delayClose;
        this.availableEvents = this.getAvailableEvents();
        this.activatorEvents = this.createActivatorEvents();
        this.contentEvents = this.createContentEvents();
        this.veilEvents = this.createVeilEvents();
        this.watchIsTopOfStack();
        this.watchActivatorEl();
        this.watchActivatorProp();
    }

    /**
     * ## Create Activator Events
     * Returns a computed set of partially available events.
     * @private
     */
    private createActivatorEvents() {
        return computed(() => {
            const events: Partial<ActivatorEvents> = {};
            if (this.isOpenOnClick()) {
                events.onClick = this.availableEvents.onClick;
            }
            if (this.isOpenOnHover()) {
                events.onMouseenter = this.availableEvents.onMouseenter;
                events.onMouseleave = this.availableEvents.onMouseleave;
            }
            if (this.isOpenOnFocus()) {
                events.onFocus = this.availableEvents.onFocus;
                events.onBlur = this.availableEvents.onBlur;
            }
            return events;
        });
    }

    /**
     * ## Create Content Events
     * @private
     */
    private createContentEvents() {
        return computed(() => {
            const events: Partial<ContentEvents> = {};
            if (this.isOpenOnHover()) {
                events.onMouseenter = () => {
                    this.isHovered = true;
                    this.delayOpen();
                };
                events.onMouseleave = () => {
                    this.isHovered = false;
                    this.delayClose();
                };
            }
            if (this.isOpenOnFocus()) {
                events.onFocusin = () => {
                    this.isFocused = true;
                    this.delayOpen();
                };
                events.onFocusout = () => {
                    this.isFocused = false;
                    this.delayClose();
                };
            }
            if (this.isCloseOnContentClick()) {
                const menu = inject(EvMenuSymbol, null);
                events.onClick = () => {
                    isActive.value = false;
                    menu?.closeParents();
                };
            }
            return events;
        });
    }

    /**
     * ## Create Delay Functions
     * @private
     */
    private createDelayFunctions() {
        return useDelayOpenClose(this.props, (value) => {
            const canOpenHover = (this.props.openOnHover && this.isHovered);
            const canOpenFocus = (openOnFocus.value && this.isFocused);
            if (
                (value === (canOpenHover || canOpenFocus))
                && !(this.props.openOnHover && this.isActive.value && !this.isTopOfStack.value)
            ) {
                if (this.isActive.value !== value) {
                    this.firstEnter = true;
                }
                this.isActive.value = value;
            }
        });
    }

    /**
     * ## Create Veil Events
     * @private
     */
    private createVeilEvents() {
        return computed(() => {
            const events: Partial<VeilEvents> = {};
            if (this.isOpenOnHover()) {
                events.onMouseenter = () => {
                    if (this.firstEnter) {
                        this.isHovered = true;
                        this.firstEnter = false;
                        this.delayOpen();
                    }
                };
                events.onMouseleave = () => {
                    this.isHovered = false;
                    this.delayClose();
                };
            }
            return events
        });
    }

    /**
     * ## Get Available Events
     */
    public getAvailableEvents(): ActivatorEvents {
        return {
            onBlur: this.onBlur,
            onClick: this.onClick,
            onFocus: this.onFocus,
            onMouseenter: this.onMouseenter,
            onMouseleave: this.onMouseleave
        };
    }

    /**
     * ## Is Close on Content Click?
     * Should we close overlays when the content of the overlay is clicked.
     * For example, when a menu item is clicked.
     */
    public isCloseOnContentClick(): boolean {
        return this.props.closeOnContentClick;
    }

    /**
     * ## Is Open On Click?
     */
    public isOpenOnClick(): boolean {
        return this.openOnClick.value;
    }

    /**
     * ## Is Open on Hover?
     */
    public isOpenOnHover(): boolean {
        return this.props.openOnHover;
    }

    /**
     * ## Is Open on Focus?
     */
    public isOpenOnFocus(): boolean {
        return this.openOnFocus.value;
    }

    /**
     * ## On Blur
     * @param e
     */
    public onBlur(e: FocusEvent) {
        e.stopPropagation();
        this.isFocused = false;
        this.delayClose();
    }

    /**
     * ## On Click
     * @param e
     */
    public onClick(e: MouseEvent) {
        e.stopPropagation();
        this.activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
        this.isActive.value = !this.isActive.value;
    }

    /**
     * ## On Focus
     * @param e
     */
    public onFocus(e: FocusEvent) {
        if (
            Browser.supportsFocusVisible
            && !(e.target as HTMLElement).matches(':focus-visible')
        ) {
            return;
        }
        e.stopPropagation();
        this.isFocused = true;
        this.activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
        this.delayOpen();
    }

    /**
     * ## On Mouse Enter (Hover)
     * @param e
     */
    public onMouseenter(e: MouseEvent) {
        if (e.sourceCapabilities?.firesTouchEvents) {
            return;
        }
        this.isHovered = true;
        this.activatorEl.value = (e.currentTarget || e.target) as HTMLElement;
        this.delayOpen();
    }

    /**
     * ## On Mouse Leave
     * @param e
     */
    public onMouseleave(e: MouseEvent) {
        this.isHovered = false;
        this.delayClose();
    }


    /**
     * ## Watch Activator Prop
     * @private
     */
    private watchActivatorProp() {
        let scope: EffectScope;
        watch(() => !!this.props.activator, (value) => {
            if (value && Browser.hasWindow) {
                scope = effectScope();
                scope.run(() => {
                    watchActivator(this.props, this.component, this.activatorEl, this.activatorEvents);
                });
            } else if (scope) {
                scope.stop();
            }
        }, { flush: 'post', immediate: true });

        onScopeDispose(() => {
            scope?.stop()
        });
    }

    /**
     * ## Watch for changes in `activatorEl`
     * @private
     */
    private watchActivatorEl() {
        watchEffect(() => {
            if (!this.activatorRef.value) {
                return;
            }
            nextTick(() => {
                this.activatorEl.value = refElement(activatorRef.value);
            });
        })
    }

    /**
     * ## Watch for changes in `isTopOfStack`.
     * @private
     */
    private watchIsTopOfStack() {
        watch(this.isTopOfStack, (value) => {
            if (value && (
                (this.isOpenOnHover() && !this.isHovered && (!this.isOpenOnFocus() || !this.isFocused)) ||
                (this.isOpenOnFocus() && !this.isFocused && (!this.isOpenOnHover() || !this.isHovered))
            )) {
                this.isActive.value = false;
            }
        });
    }
}

function watchActivator (
    props: ActivatorProps,
    component: ComponentInternalInstance,
    activatorEl: Ref<HTMLElement | undefined>,
    activatorEvents: ComputedRef<Partial<ActivatorEvents>>
) {

    watch(() => props.activator, (val, oldVal) => {
        if (oldVal && val !== oldVal) {
            const activator = getActivator(oldVal);
            activator && unbindActivatorProps(activator);
        }
        if (val) {
            nextTick(() => bindActivatorProps());
        }
    }, { immediate: true });

    watch(() => props.activatorProps, () => {
        bindActivatorProps();
    });

    onScopeDispose(() => {
        unbindActivatorProps();
    });

    function bindActivatorProps (el = getActivator(), _props = props.activatorProps) {
        if (!el) {
            return;
        }
        bindProps(el, mergeProps(activatorEvents.value, _props));
    }

    function unbindActivatorProps (el = getActivator(), _props = props.activatorProps) {
        if (!el) {
            return;
        }
        unbindProps(el, mergeProps(activatorEvents.value, _props));
    }

    function getActivator (selector = props.activator): HTMLElement | undefined {
        let activator;
        if (selector) {
            if (selector === 'parent') {
                let el = component?.proxy?.$el?.parentNode;
                while (el.hasAttribute('data-no-activator')) {
                    el = el.parentNode;
                }
                activator = el;
            } else if (typeof selector === 'string') {
                // Selector
                activator = document.querySelector(selector);
            } else if ('$el' in selector) {
                // Component (ref)
                activator = selector.$el;
            } else {
                // HTMLElement | Element
                activator = selector;
            }
        }

        // The activator should only be a valid element (Ignore comments and text nodes)
        activatorEl.value = (activator?.nodeType === Node.ELEMENT_NODE) ? activator : null;

        return activatorEl.value;
    }
}