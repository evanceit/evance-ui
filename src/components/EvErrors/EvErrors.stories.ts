import type {Meta, StoryObj} from "@storybook/vue3";

import {EvErrors} from "../EvErrors";

const meta: Meta<typeof EvErrors> = {
    component: EvErrors,
    title: 'Forms/EvErrors',
    argTypes: {
        messages: {
            control: 'array',
            description: "The `messages` prop may contain an array of zero or more error messages or a string"
        }
    },
    args: {
        messages: [
            "Required"
        ]
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvErrors>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvErrors },
        setup() {
            return { args };
        },
        template: '<ev-errors v-bind="args" />'
    }),
};