import type {Meta, StoryObj} from "@storybook/vue3";

import { EvOverlay } from "../EvOverlay";

const meta: Meta<typeof EvOverlay> = {
    component: EvOverlay,
    argTypes: {
        modelValue: {
            control: 'boolean',
            description: "Applied via `v-model` allows two-way binding of whether the show/hide the overlay."
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
        transition: 'true',
        veil: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvOverlay>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvOverlay },
        setup() {
            return { args };
        },
        template: '<ev-overlay v-bind="args">Hello World</ev-overlay>'
    })
};