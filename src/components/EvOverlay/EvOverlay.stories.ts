import type { Meta, StoryObj } from "@storybook/vue3";

import { EvOverlay } from "../EvOverlay";
import { EvButton } from "../EvButton";
import { EvSurface } from "../EvSurface";

const meta: Meta<typeof EvOverlay> = {
    component: EvOverlay,
    title: "Overlays/EvOverlay",
    argTypes: {
        modelValue: {
            control: "boolean",
            description:
                "Applied via `v-model` allows two-way binding of whether to show/hide the overlay.",
        },
        offset: {
            control: "number",
            description:
                "The distance to offset the content from the activator in pixels.",
        },
        openDelay: {
            control: "number",
            description:
                "The duration to delay before opening the overlay in ms for hover and focus events.",
        },
        closeDelay: {
            control: "number",
            description:
                "The duration to delay before closing the overlay in ms for hover and focus events.",
        },
        closeOnContentClick: {
            control: "boolean",
            description:
                "Closes component when you click on its content. This is primarily used when the content represents a " +
                "state or navigational change (e.g. a Menu).",
        },
        openOnClick: {
            control: "boolean",
            description: "Open the overlay when the `activator` is clicked.",
        },
        openOnHover: {
            control: "boolean",
            description:
                "Open the overlay when the mouse hovers over the activator.",
        },
        openOnFocus: {
            control: "boolean",
            description:
                "Open the overlay when the activator is focused (usually with a keyboard event).",
        },
        persistent: {
            control: "boolean",
            description:
                "A persistent overlay cannot be dismissed by clicking outside the overlay content, nor by pressing escape. " +
                "The overlay must be dismissed by other functionality.",
        },
        position: {
            control: "select",
            options: [
                "auto",
                "auto-start",
                "auto-end",
                "top",
                "top-start",
                "top-end",
                "bottom",
                "bottom-start",
                "bottom-end",
                "left",
                "left-start",
                "left-end",
                "right",
                "right-start",
                "right-end",
                "center",
            ],
            description:
                "Position in relation to the activator. " +
                "A value of `auto` with calculate the side with the most available space. " +
                "The only exception is `center` which is centered to the viewport of the overlay. ",
        },
        positionStrategy: {
            control: "select",
            options: ["connected", "fixed"],
        },
        scrollStrategy: {
            control: "select",
            options: ["none", "close", "block", "reposition"],
            mapping: {
                none: null,
                close: "close",
                block: "block",
                reposition: "reposition",
            },
            description:
                "The scroll strategy can either `close` the overlay on scroll, `block` scroll events, or `reposition` " +
                "the content of the overlay on scroll. You may also provide your own function.",
        },
        transition: {
            control: "select",
            options: ["true", "false", "transition-fade"],
            mapping: {
                true: true,
                false: false,
                "transition-fade": "transition-fade",
            },
            description:
                "Transition of the overlay content may be a string containing an existing or custom transition class. " +
                "OR a boolean where `true` enables transitions using the default transition, `false` disables transitions. " +
                "OR a transition object.",
        },
        veil: {
            control: "boolean",
            description: "Whether to cover/conceal the background with a veil.",
        },
    },
    args: {
        modelValue: false,
        offset: 0,
        openDelay: 0,
        closeDelay: 0,
        openOnClick: true,
        openOnHover: false,
        openOnFocus: false,
        closeOnContentClick: false,
        persistent: false,
        position: "auto",
        transition: true,
        veil: true,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvOverlay>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvOverlay, EvButton, EvSurface },
        setup() {
            return { args };
        },
        template:
            '<ev-button id="example">Button "id" as Activator</ev-button>' +
            '<ev-overlay v-bind="args" activator="#example">' +
            '<ev-surface elevation="overlay" width="400" height="120" style="padding: 20px;">' +
            '<ev-button @click="args.modelValue = false">Close</ev-button>' +
            "</ev-surface>" +
            "</ev-overlay>",
    }),
};

export const ActivatorInside: Story = {
    render: (args: any) => ({
        components: { EvOverlay, EvButton, EvSurface },
        setup() {
            return { args };
        },
        template:
            '<ev-overlay v-bind="args">' +
            '<template #activator="{ isActive, props }"><ev-button v-bind="props">Activator inside</ev-button></template>' +
            '<ev-surface elevation="overlay" width="400" height="120" style="padding: 20px;">' +
            '<ev-button @click="args.modelValue = false">Close</ev-button>' +
            "</ev-surface>" +
            "</ev-overlay>",
    }),
};
