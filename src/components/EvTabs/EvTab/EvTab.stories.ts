import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTab } from "../EvTab";

const meta: Meta<typeof EvTab> = {
    component: EvTab,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTab>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTab },
        setup() {
            const reset = () => {
                args['onUpdate:modelValue'](true);
            };
            return { args };
        },
        template: `
            <ev-tab v-bind="args">Hello</ev-tab>
        `
    })
};