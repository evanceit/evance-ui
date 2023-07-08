import type {Meta, StoryObj} from "@storybook/vue3";

import { EvCheckbox } from "../EvCheckbox";

const meta: Meta<typeof EvCheckbox> = {
    component: EvCheckbox,
    argTypes: {
        modelValue: {
            control: 'string',
            description: "Set via the `v-model` directive."
        },
        disabled: {
            control: 'boolean'
        },
        value: {
            control: 'string',
            description: "The value of the input is assigned to `modelValue` when checked."
        }
    },
    args: {
        modelValue: null,
        value: 'Y',
        disabled: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvCheckbox>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvCheckbox },
        setup() {
            return { args };
        },
        template: '<ev-checkbox v-bind="args" /> {{ args.modelValue }}'
    })
};