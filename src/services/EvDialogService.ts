import {App, h, markRaw, mergeProps, nextTick, render, shallowRef, toRaw, watch} from "vue";
import {EvDialogSymbol} from "@/composables/dialog.ts";
import {EvDialog} from "@/components";

/**
 * EvDialogService
 *
 * @todo: we need some way for the service to mount itself
 *
 * I have seen this done before int a basic confirm dialog plugin
 * we need to do something similar but in a more advanced way.
 * @see https://github.com/Godofbrowser/vuejs-dialog/blob/master/src/plugin/js/index.js
 */
export const EvDialogService = {
    install: (app: App) => {


        const service = {
            open: (options) => {
                let instance;
                let node = document.createElement('div');
                node.id = 'test-1';
                document.querySelector('body')!.appendChild(node);

                const modelValue = shallowRef(false);
                const props = options.props ?? {};
                const internalSlots = options.slots ?? {};
                const renderedSlots = {};

                // Build slots
                for (const key in internalSlots) {
                    const component = internalSlots[key];
                    renderedSlots[key] = (props, slots) => {
                        return h(component, props, slots);
                    };
                }

                function onAfterLeave() {
                    const el = instance.$el.parentNode;
                    render(null, el);
                    el.parentNode.removeChild(el);
                }

                const renderedDialog = h(
                    EvDialog,
                    mergeProps(
                        props,
                        {
                            modelValue,
                            onAfterLeave
                        },
                    ),
                    renderedSlots
                );
                renderedDialog.appContext = app._context;
                render(renderedDialog, node);
                instance = renderedDialog.component.proxy;
                nextTick(() => {
                    modelValue.value = true;
                });
            }
        };

        // For options API - use with `this.$dialog`
        app.config.globalProperties.$dialog = service;

        // For composition API - use with `useDialog()`
        app.provide(EvDialogSymbol, service);
    }
};

export default EvDialogService;