import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDatePicker } from "../EvDatePicker";

const meta: Meta<typeof EvDatePicker> = {
    component: EvDatePicker,
    argTypes: {
        min: {
            control: 'text',
            description: 'The minimum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.'
        },
        max: {
            control: 'text',
            description: 'The maximum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.'
        },
        multiple: {
            control: "boolean",
            description: "Allow multiple dates to be selected."
        },
        'show-adjacent-months': {
            control: "boolean"
        }
    },
    args: {
        min: null,
        max: null,
        multiple: false,
        'show-adjacent-months': true,
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