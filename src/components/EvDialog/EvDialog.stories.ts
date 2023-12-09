import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDialog } from "../EvDialog";
import {shallowRef} from "vue";
import {Collapse, Expand, ArrowContinue} from "@/icons";
import DialogHeaderExample from '@/stories/assets/dialog-header-example.png?url';
import {EvSurface, EvButton} from "@/components";
import EvOverlayStories from "../EvOverlay/EvOverlay.stories.ts";
import {omit} from "@/util";

const meta: Meta<typeof EvDialog> = {
    components: {EvSurface, EvButton, Collapse, Expand},
    component: EvDialog,
    title: "Overlays/EvDialog",
    argTypes: {
        fullscreen: {
            control: 'boolean',
            description: 'Forces a dialog to enter fullscreen mode. This does not use the fullscreen API, ' +
                'it maximizes the dialog to the full window size. Defaults to `false`.'
        },
        showHeader: {
            control: 'boolean',
            description: "The default `EvDialogHeader` includes a Close icon. " +
                "However, you can add further tools/icons to the header using the `header` slot." +
                "In most scenarios we want to show a close icon, so this defaults to `true`."
        },
        width: {
            control: 'select',
            options: ['small', 'medium', 'large', 'x-large', 500, '300px', '75%'],
            description: "Evance UI attempts to standardise dialog widths using named sizes:" +
                "`small`, `medium` (default), `large`, and `x-large`. This is the recommended usage." +
                "However, the `width` may also be set to a number in pixels, or as a percentage."
        },
        header: {
            description: "The default `EvDialogHeader` is intended to accommodate most scenarios in Evance where" +
                "a cancel icon is available to close a dialog. You can add additional icons/buttons to the header " +
                "using the `header` slot."
        },
        default: {
            description: "The `default` slot is rendered within the standard `EvDialogBody` which offers padding " +
                "appropriate for most content and forms. `EvDialogBody` comes scrollable by default."
        },
        footer: {
            description: 'The default `EvDialogFooter` is intended for adding action buttons to a dialog. ' +
                'By default it will align buttons to the right and standardises the spacing between buttons. ' +
                'If you do not add any buttons to the `footer` slot, it will not render - allowing the `body` ' +
                'slot to extend to the full height of the dialog.'
        },

        // EvOverlayProps

        ...omit(EvOverlayStories.argTypes, [
            'offset',
            'origin',
            'scroll-strategy',
            'position',
            'position-strategy',
            'transition'
        ])

    },
    args: {
        fullscreen: undefined,
        width: undefined,

        ...omit(EvOverlayStories.args, [
            'offset',
            'origin',
            'scroll-strategy',
            'position',
            'position-strategy',
            'transition'
        ])
    }
};

export default meta;

type Story = StoryObj<typeof EvDialog>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDialog, EvButton, Expand, Collapse },
        setup() {

            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            function fullscreen() {
                args.fullscreen = !args.fullscreen;
            }

            return { args, close, modelValue, Collapse, Expand, fullscreen };
        },
        template: `
            <ev-dialog v-bind="args" v-model="modelValue">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props">Open</ev-button>
                </template>
                <template #default>
                    <h3>Example dialog</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                </template>
                <template #footer>
                    <ev-button @click="close()">Close</ev-button>
                    <ev-button @click="close()" appearance="primary">Save</ev-button>
                </template>
            </ev-dialog>
        `
    })
};

export const ScrollingBody: Story = {
    render: () =>  ({
        components: { EvDialog, EvButton },
        setup() {

            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            return { close, modelValue };
        },
        template: `
            <ev-dialog v-model="modelValue">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props">Open</ev-button>
                </template>
                <template #default>
                    <h3>Hello</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices dapibus tortor ac rutrum.
                        Integer elementum mauris nisi, ut vestibulum est auctor vitae. Proin sodales odio augue,
                        sed porta ante molestie in. Etiam consectetur sed nisi quis vehicula. Vivamus semper massa
                        sed dapibus dignissim. Aliquam erat volutpat. In libero dolor, tincidunt quis elementum in,
                        luctus ut purus. Nunc quis cursus nisi, ut sollicitudin eros. Aliquam ac nisi ac turpis consequat
                        vehicula eu eu tellus. Donec eros nisl, luctus in nunc sit amet, tristique dictum odio.
                        Curabitur rhoncus blandit sodales.
                    </p>
                </template>
            </ev-dialog>
        `
    })
};



export const CustomContainer: Story = {
    render: () =>  ({
        components: { EvDialog, EvButton, DialogHeaderExample, EvSurface, ArrowContinue },
        setup() {

            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            return { close, modelValue, DialogHeaderExample, EvSurface, ArrowContinue };
        },
        template: `
            <ev-dialog v-model="modelValue">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props">Open</ev-button>
                </template>
                <template #container>
                    <ev-surface elevation="overlay" rounded="small">
                        <img :src="DialogHeaderExample" style="margin-top: -99px">
                        <div style="padding: 0 2rem 2rem; text-align: center">
                            <h3>New inventory system</h3>
                            <p>
                                Discover a world of new functionality.
                            </p>
                            <div style="display: flex; gap: 1rem; justify-content: center">
                                <ev-button @click="close" appearance="subtle">Remind me later</ev-button>
                                <ev-button :icon-end="ArrowContinue" appearance="primary" @click="close">Hell yeah, continue</ev-button>
                            </div>
                        </div>
                            
                    </ev-surface>
                </template>
            </ev-dialog>
        `
    })
};