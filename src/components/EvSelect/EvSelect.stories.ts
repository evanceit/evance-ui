import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSelect } from "../EvSelect";

const meta: Meta<typeof EvSelect> = {
    component: EvSelect,
    title: 'Forms/EvSelect',
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSelect>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSelect },
        setup() {
            return { args };
        },
        template: '<ev-select v-bind="args" />'
    })
};