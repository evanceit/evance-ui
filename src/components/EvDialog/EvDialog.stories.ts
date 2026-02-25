import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDialog } from "../EvDialog";
import { shallowRef } from "vue";
import { CollapseIcon, ExpandIcon, ArrowContinueIcon, CartIcon } from "@/icons";
import DialogHeaderExample from "@/stories/assets/dialog-header-example.png?url";
import { EvSurface, EvButton } from "@/components";
import EvOverlayStories from "../EvOverlay/EvOverlay.stories";
import { omit } from "@/util";

const meta: Meta<typeof EvDialog> = {
    component: EvDialog,
    title: "Components/Overlays/EvDialog",
    argTypes: {
        closeable: {
            control: "boolean",
            description:
                "Whether the dialog should show the close button. " +
                "Alternatively, if you do not require the header, use `hide-header`.",
        },
        default: {
            description:
                "The `default` slot is rendered within the standard `EvDialogBody` which offers padding " +
                "appropriate for most content and forms. `EvDialogBody` comes scrollable by default.",
        },
        draggable: {
            control: "boolean",
            description:
                "Whether the dialog is draggable. Defaults to `false`.",
        },
        dragWithinViewport: {
            control: "boolean",
            description:
                "Keeps the dialog within the viewport's bounding area when dragging. Defaults to `true`.",
        },
        dragMinX: {
            control: "number",
            description:
                "The minimum value for the left coordinate of the dialog when dragging. Defaults to `0`.",
        },
        dragMinY: {
            control: "number",
            description:
                "The minimum valye of the top coordinate of the dialog when dragging. Defaults to `0`.",
        },
        footer: {
            description:
                "The default `EvDialogFooter` is intended for adding action buttons to a dialog. " +
                "By default it will align buttons to the right and standardises the spacing between buttons. " +
                "If you do not add any buttons to the `footer` slot, it will not render - allowing the `body` " +
                "slot to extend to the full height of the dialog.",
        },
        fullscreen: {
            control: "boolean",
            description:
                "Forces a dialog to enter fullscreen mode. This does not use the fullscreen API, " +
                "it maximizes the dialog to the full window size. Defaults to `false`.",
        },
        header: {
            description:
                "The default `EvDialogHeader` is intended to accommodate most scenarios in Evance where" +
                "a cancel icon is available to close a dialog. You can add additional icons/buttons to the header " +
                "using the `header` slot.",
        },
        headerActions: {
            control: false,
            description:
                "Add actions to the header bar as an array of `EvButton` props. " +
                "May also be supplied via `header-props.actions`.",
        },
        headerProps: {
            control: false,
            description: "Accepts any `EvToolbar` props.",
        },
        hideHeader: {
            control: "boolean",
            description:
                "Hides the header component including the default close icon. Defaults to `false`. " +
                "Hiding the header also disables the ability to drag.",
        },
        icon: {
            control: "select",
            description:
                "An icon may be added to the dialog's header. " +
                "May also be supplied via `header-props.icon`. " +
                "If you would like a custom header use the `header` slot.",
            options: ["none", "CartIcon"],
            mapping: {
                none: undefined,
                CartIcon: CartIcon,
            },
        },
        noPadding: {
            control: "boolean",
            description:
                "Removes padding from the body, which is useful if you'd like a custom body layout without needing to " +
                "construct a complete dialog layout using the `container` slot. " +
                "May also be set via the `body-props.padding` setting.",
        },
        title: {
            control: "text",
            description:
                "Optional, a title may be applied to the dialog's header. " +
                "May also be supplied via `header-props.title`." +
                "If you would like a custom header use the `header` slot. ",
        },
        width: {
            control: "select",
            options: [
                "small",
                "medium",
                "large",
                "x-large",
                500,
                "300px",
                "75%",
            ],
            description:
                "Evance UI attempts to standardise dialog widths using named sizes:" +
                "`small`, `medium` (default), `large`, and `x-large`. This is the recommended usage." +
                "However, the `width` may also be set to a number in pixels, or as a percentage.",
        },

        // EvOverlayProps

        ...omit(EvOverlayStories.argTypes as any, [
            "offset",
            "origin",
            "scroll-strategy",
            "position",
            "position-strategy",
            "transition",
        ]),
    },
    args: {
        closeable: true,
        draggable: false,
        dragMinX: 0,
        dragMinY: 0,
        dragWithinViewport: true,
        fullscreen: undefined,
        hideHeader: false,
        icon: undefined,
        noPadding: false,
        title: undefined,
        width: undefined,
        ...omit(EvOverlayStories.args as any, [
            "offset",
            "origin",
            "scroll-strategy",
            "position",
            "position-strategy",
            "transition",
        ]),
    },
};

export default meta;

type Story = StoryObj<typeof EvDialog>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDialog, EvButton },
        setup() {
            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            function fullscreen() {
                args.fullscreen = !args.fullscreen;
            }

            return {
                args,
                close,
                modelValue,
                CollapseIcon,
                ExpandIcon,
                fullscreen,
            };
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
        `,
    }),
};

export const ScrollingBody: Story = {
    render: () => ({
        components: { EvDialog, EvButton },
        setup() {
            const modelValue = shallowRef(false);
            const fullscreen = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            function expand() {
                fullscreen.value = !fullscreen.value;
            }

            const headerProps = {
                actions: [{ icon: ExpandIcon, onClick: expand }],
                size: "small",
            };

            return { close, modelValue, expand, fullscreen, headerProps };
        },
        template: `
            <ev-dialog v-model="modelValue" :fullscreen="fullscreen" :header-props="headerProps">
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
        `,
    }),
};

export const CustomContainer: Story = {
    render: () => ({
        components: { EvDialog, EvButton, EvSurface },
        setup() {
            const modelValue = shallowRef(false);

            function close() {
                modelValue.value = false;
            }

            return {
                close,
                modelValue,
                DialogHeaderExample,
                EvButton,
                EvSurface,
                ArrowContinueIcon,
            };
        },
        template: `
            <ev-dialog v-model="modelValue">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props">Open</ev-button>
                </template>
                <template #container>
                    <ev-surface elevation="overlay" rounded="small">
                        <img :src="DialogHeaderExample" style="margin-top: -99px" alt="">
                        <div style="padding: 0 2rem 2rem; text-align: center">
                            <h3>New inventory system</h3>
                            <p>
                                Discover a world of new functionality.
                            </p>
                            <div style="display: flex; gap: 1rem; justify-content: center">
                                <ev-button @click="close" variant="subtle">Remind me later</ev-button>
                                <ev-button :icon-end="ArrowContinueIcon" appearance="primary" @click="close">Hell yeah, continue</ev-button>
                            </div>
                        </div>

                    </ev-surface>
                </template>
            </ev-dialog>
        `,
    }),
};
