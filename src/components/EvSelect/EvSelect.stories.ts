import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSelect } from "../EvSelect";
import {InputAppearance} from "../../util";

const meta: Meta<typeof EvSelect> = {
    component: EvSelect,
    title: 'Forms/EvSelect',
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(InputAppearance)
        },
        disabled: {
            control: 'boolean'
        },
        prefix: {
            control: 'text',
            description: "Appears before the input field but after the `icon`. "
                + "May be used as a prop for a simple text-based prefix, or as a slot for a more complex prefix. "
                + "In this demo we use a prop."
        },
        rounded: {
            control: 'boolean',
        },
        suffix: {
            control: 'text',
            description: "Appears after the input field. "
                + "May be used as a prop when a text suffix is required, or as a slot for a more complex suffix. "
                + "In this demo we use a prop."
        },
    },
    args: {
        appearance: InputAppearance.default,
        disabled: false,
        rounded: false,
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