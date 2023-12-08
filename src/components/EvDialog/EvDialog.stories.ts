import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDialog } from "../EvDialog";
import { EvButton } from "../EvButton";
import {shallowRef} from "vue";

const meta: Meta<typeof EvDialog> = {
    components: {EvButton},
    component: EvDialog,
    argTypes: {
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
        footer: {
            description: 'The default `EvDialogFooter` is intended for adding action buttons to a dialog.' +
                'By default it will align buttons to the right and standardises the spacing between buttons.'
        }
    },
    args: {
        width: undefined
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDialog>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDialog, EvButton },
        setup() {

            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            return { args, close, modelValue };
        },
        template: `
            <ev-dialog v-bind="args" v-model="modelValue">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props" :appearance="isActive ? 'primary' : 'default'">Open</ev-button>
                </template>
                <template #body>
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
                <template #footer>
                    <ev-button @click="close()">Close</ev-button>
                    <ev-button @click="close()" appearance="primary">Save</ev-button>
                </template>
            </ev-dialog>
        `
    })
};