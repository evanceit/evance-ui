import type {Meta, StoryObj} from "@storybook/vue3";

import { EvOverlay } from "../EvOverlay";
import {EvButton} from "../EvButton";
import {EvSurface} from "../EvSurface";

const meta: Meta<typeof EvOverlay> = {
    component: EvOverlay,
    argTypes: {
        modelValue: {
            control: 'boolean',
            description: "Applied via `v-model` allows two-way binding of whether the show/hide the overlay."
        },
        offset: 'number',
        persistent: {
            control: 'boolean',
            description: "A persistent overlay cannot be dismissed by clicking outside the overlay content, nor by pressing escape. " +
                "The overlay must be dismissed by other functionality."
        },
        position: {
            control: "select",
            options: [
                'auto',
                'auto-start',
                'auto-end',
                'top',
                'top-start',
                'top-end',
                'bottom',
                'bottom-start',
                'bottom-end',
                'left',
                'left-start',
                'left-end',
                'right',
                'right-start',
                'right-end',
                'center'
            ]
        },
        scrollStrategy: {
            control: "select",
            options: ['none', 'close', 'block', 'reposition'],
            mapping: {
                'none' : null,
                'close': 'close',
                'block': 'block',
                'reposition': 'reposition'
            }
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
        offset: 0,
        persistent: false,
        position: 'auto',
        transition: 'true',
        veil: true
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvOverlay>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvOverlay, EvButton, EvSurface },
        setup() {

            return { args };
        },
        template: '<ev-button id="example">Button "id" as Activator</ev-button>' +
            '<ev-overlay v-bind="args" activator="#example">' +
            '<ev-surface elevation="overlay" width="400" height="1200" style="padding: 20px;">' +
            '<ev-button @click="args.modelValue = !args.modelValue">Close</ev-button>' +
            '</ev-surface>' +
            '</ev-overlay>'
    })
};
