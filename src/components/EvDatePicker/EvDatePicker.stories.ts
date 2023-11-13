import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDatePicker } from "../EvDatePicker";

const meta: Meta<typeof EvDatePicker> = {
    component: EvDatePicker,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDatePicker>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDatePicker },
        setup() {
            return { args };
        },
        template: `<ev-date-picker />`
    })
};