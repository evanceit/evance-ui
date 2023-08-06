import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSelect } from "../EvSelect";
import {InputAppearance} from "../../util";
import {Search} from "../../icons";

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
        'icon-start': {
            control: 'select',
            options: ['none', 'Search'],
            mapping: {
                'none': null,
                'Search': Search
            },
            description: "Appears before input prefix. "
        },
        multiple: {
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
        'icon-start': 'none',
        multiple: false,
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

            const items = [
                {
                    title: 'England',
                    value: 1
                },
                {
                    title: 'Scotland',
                    value: 2
                },
                {
                    title: 'Wales',
                    value: 3
                }
            ];

            return { args, items };
        },
        template: '<ev-select v-bind="args" :items="items" />'
    })
};