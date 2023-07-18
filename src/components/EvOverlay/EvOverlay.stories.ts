import type {Meta, StoryObj} from "@storybook/vue3";

import { EvOverlay } from "../EvOverlay";

const meta: Meta<typeof EvOverlay> = {
    component: EvOverlay,
    argTypes: {
        modelValue: {
            control: 'boolean'
        },
        veil: {
            control: 'boolean'
        }
    },
    args: {
        modelValue: false,
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
        template: '<ev-overlay v-bind="args">Hello</ev-overlay>'
    })
};