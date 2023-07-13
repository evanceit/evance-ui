import type {Meta, StoryObj} from "@storybook/vue3";

import { EvRadio } from "../EvRadio";

const meta: Meta<typeof EvRadio> = {
    component: EvRadio,
    title: "Forms/EvRadio",
    argTypes: {
        modelValue: {
            control: 'string',
            description: "Set via the `v-model` directive."
        },
        clearable: {
            control: 'boolean',
            description: "When set to `true` the component may be unchecked if currently checked. " +
                "This then sets the `modelValue` to `null`."
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
        modelValue: 'N',
        value: 'Y',
        clearable: false,
        disabled: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvRadio>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvRadio },
        setup() {
            return { args };
        },
        template: '<ev-radio v-bind="args" />'
    })
};