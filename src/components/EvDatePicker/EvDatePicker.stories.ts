import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDatePicker } from "../EvDatePicker";

const meta: Meta<typeof EvDatePicker> = {
    component: EvDatePicker,
    argTypes: {
        multiple: {
            control: "boolean",
            description: "Allow multiple dates to be selected."
        },
        'show-adjacent-months': {
            control: "boolean"
        }
    },
    args: {
        multiple: false,
        'show-adjacent-months': false,
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
        template: `<ev-date-picker v-bind="args" />`
    })
};