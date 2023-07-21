import type {Meta, StoryObj} from "@storybook/vue3";

import { EvOverlay } from "../EvOverlay";
import {EvButton} from "../EvButton";

const meta: Meta<typeof EvOverlay> = {
    component: EvOverlay,
    argTypes: {
        modelValue: {
            control: 'boolean',
            description: "Applied via `v-model` allows two-way binding of whether the show/hide the overlay."
        },
        persistent: {
            control: 'boolean',
            description: "A persistent overlay cannot be dismissed by clicking outside the overlay content, nor by pressing escape. " +
                "The overlay must be dismissed by other functionality."
        },
        transition: {
            control: 'select',
            options: ['true', 'false', 'transition-fade'],
            mapping: {
                'true': true,
                'false': false,
                'transition-fade': 'transition-fade'
            },
            description: "Transition of the overlay content may be a string containing an existing or custom transition class. " +
                "OR a boolean where `true` enables transitions using the default transition, `false` disables transitions. " +
                "OR a transition object."
        },
        veil: {
            control: 'boolean',
            description: "Whether to cover/conceal the background with a veil."
        }
    },
    args: {
        modelValue: false,
        persistent: false,
        transition: 'true',
        veil: true
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvOverlay>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvOverlay, EvButton },
        setup() {
            return { args };
        },
        template: '<ev-button id="foo">Button "id" as Activator</ev-button>' +
            '<ev-overlay v-bind="args" activator="#foo"><ev-button @click="args.modelValue = !args.modelValue">Close</ev-button></ev-overlay>'
    })
};

export const ActivatorInside: Story = {
    render: (args: any) =>  ({
        components: { EvOverlay, EvButton },
        setup() {
            return { args };
        },
        template: '<ev-overlay v-bind="args">' +
            '<template #activator="{ isActive, props }"><ev-button v-bind="props">Button in Activator Slot</ev-button></template>' +
            '<template #default><ev-button @click="args.modelValue = !args.modelValue">Close</ev-button></template>' +
            '</ev-overlay>'
    })
};

export const ActivatorParent: Story = {
    render: (args: any) =>  ({
        components: { EvOverlay, EvButton },
        setup() {
            return { args };
        },
        template: '<ev-button>Button as "parent" activator <ev-overlay v-bind="args" activator="parent">' +
            '<ev-button @click="args.modelValue = !args.modelValue">Close</ev-button>' +
            '</ev-overlay></ev-button>'
    })
};