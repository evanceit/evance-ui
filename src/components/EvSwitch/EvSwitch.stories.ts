import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSwitch } from "../EvSwitch";

const meta: Meta<typeof EvSwitch> = {
    component: EvSwitch,
    title: 'Forms/EvSwitch',
    argTypes: {
        modelValue: {
            control: 'boolean',
            description: "Set via the `v-model` directive."
        },
        disabled: {
            control: 'boolean'
        }
    },
    args: {
        modelValue: false,
        disabled: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSwitch>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSwitch },
        setup() {
            return { args };
        },
        template: '<ev-switch v-bind="args" />'
    })
};