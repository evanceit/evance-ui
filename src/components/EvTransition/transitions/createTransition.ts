import { defineComponent, h, PropType, Transition, TransitionGroup } from "vue";
import { prefersReducedMotion, propsFactory } from "@/util";

export const makeTransitionProps = propsFactory(
    {
        disabled: Boolean,
        group: Boolean,
        hideOnLeave: Boolean,
        leaveAbsolute: Boolean,
        mode: String,
        origin: String,
    },
    "transition",
);

type InitialStyles = Pick<
    CSSStyleDeclaration,
    "position" | "top" | "left" | "width" | "height"
>;

const initialStyles = new WeakMap<HTMLElement, InitialStyles>();

/**
 * # `createCssTransition`
 *
 * @param name
 * @param origin
 * @param mode
 */
export function createCssTransition(
    name: string,
    origin?: string,
    mode?: string,
) {
    return defineComponent({
        name,
        props: makeTransitionProps({ mode, origin }),
        setup(props, { slots }) {
            const functions = {
                onBeforeEnter(el: HTMLElement) {
                    if (props.origin) {
                        el.style.transformOrigin = props.origin;
                    }
                },
                onLeave(el: HTMLElement) {
                    if (props.leaveAbsolute) {
                        const {
                            offsetTop,
                            offsetLeft,
                            offsetWidth,
                            offsetHeight,
                        } = el;
                        initialStyles.set(el, {
                            position: el.style.position,
                            top: el.style.top,
                            left: el.style.left,
                            width: el.style.width,
                            height: el.style.height,
                        });
                        el.style.position = "absolute";
                        el.style.top = `${offsetTop}px`;
                        el.style.left = `${offsetLeft}px`;
                        el.style.width = `${offsetWidth}px`;
                        el.style.height = `${offsetHeight}px`;
                    }

                    if (props.hideOnLeave) {
                        el.style.setProperty("display", "none", "important");
                    }
                },
                onAfterLeave(el: HTMLElement) {
                    const saved = props.leaveAbsolute
                        ? initialStyles.get(el)
                        : undefined;
                    if (saved) {
                        initialStyles.delete(el);
                        el.style.position = saved.position || "";
                        el.style.top = saved.top || "";
                        el.style.left = saved.left || "";
                        el.style.width = saved.width || "";
                        el.style.height = saved.height || "";
                    }
                },
            };

            return () => {
                const tag = props.group ? TransitionGroup : Transition;
                return h(
                    tag as any,
                    {
                        name: props.disabled ? "" : name,
                        css: !props.disabled,
                        ...(props.group ? {} : { mode: props.mode }),
                        ...(props.disabled ? {} : functions),
                    },
                    slots.default,
                );
            };
        },
    });
}

/**
 * # `createJavaScriptTransition`
 *
 * @param name
 * @param functions
 * @param mode
 *
 */
export function createJavaScriptTransition(
    name: string,
    functions: Record<string, any>,
    mode: "in-out" | "out-in" | "default" = "in-out",
) {
    return defineComponent({
        name,

        props: {
            mode: {
                type: String as PropType<"in-out" | "out-in" | "default">,
                default: mode,
            },
            disabled: {
                type: Boolean,
                default: () => prefersReducedMotion(),
            },
            group: Boolean,
            hideOnLeave: Boolean,
        },

        setup(props, { slots }) {
            return () => {
                const tag = props.group ? TransitionGroup : Transition;

                return h(
                    tag as any,
                    {
                        name: props.disabled ? "" : name,
                        css: !props.disabled,
                        ...(props.disabled
                            ? {}
                            : {
                                ...functions,
                                onLeave: (el: HTMLElement) => {
                                    if (props.hideOnLeave) {
                                        el.style.setProperty(
                                            "display",
                                            "none",
                                            "important",
                                        );
                                    } else {
                                        functions.onLeave?.(el);
                                    }
                                },
                            }),
                    },
                    slots.default,
                );
            };
        },
    });
}


