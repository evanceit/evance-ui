import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTextfield } from "../EvTextfield";

const meta: Meta<typeof EvTextfield> = {
    component: EvTextfield,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTextfield>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTextfield },
        setup() {
            return { args };
        },
        template: '<ev-textfield v-bind="args" />'
    })
};