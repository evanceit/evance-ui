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
        clearable: {
            control: 'boolean'
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
        'open-on-clear': {
            control: 'boolean'
        },
        prefix: {
            control: 'text',
            description: "Appears before the input field but after the `icon`. "
                + "May be used as a prop for a simple text-based prefix, or as a slot for a more complex prefix. "
                + "In this demo we use a prop."
        },
        'return-object': {
            control: 'boolean',
            description: "When `true` the `v-model` bound to the EvSelect will receive the full item instead of the item's value."
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
        clearable: false,
        disabled: false,
        'icon-start': 'none',
        multiple: false,
        'open-on-clear': false,
        'return-object': false,
        rounded: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSelect>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSelect },
        data() {

            let selected = {
                title: 'Item '
            }

            return {
                selected: null
            }
        },
        setup() {

            const items = [];
            for (let i = 0; i < 1000; i++) {
                const num = i + 1;
                items.push({
                    title: `Item ${num}`,
                    value: num
                });
            }

            return { args, items };
        },
        template: '{{ selected }} <ev-select v-bind="args" v-model="selected" :items="items" />'
    })
};