import type {Meta, StoryObj} from "@storybook/vue3";

import { EvProgressCircular } from "../EvProgressCircular";

const meta: Meta<typeof EvProgressCircular> = {
    component: EvProgressCircular,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvProgressCircular>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvProgressCircular },
        setup() {
            return { args };
        },
        template: '<ev-progress-circular v-bind="args"></ev-progress-circular>'
    })
};