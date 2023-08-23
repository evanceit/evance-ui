import type {Meta, StoryObj} from "@storybook/vue3";
import {EvForm} from "@/components/EvForm";

const meta: Meta<typeof EvForm> = {
    component: EvForm,
    title: 'Forms/EvForm',
    argTypes: {

    },
    args: {

    }
};

export default meta;

type Story = StoryObj<typeof EvForm>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvForm },
        setup() {
            return { args };
        },
        template: '<ev-form>Foo</ev-form>'
    }),
};