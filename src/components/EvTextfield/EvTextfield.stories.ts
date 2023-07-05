import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTextfield } from "../EvTextfield";
import {Search} from "../../icons";

const meta: Meta<typeof EvTextfield> = {
    component: EvTextfield,
    argTypes: {
        autofocus: {
            control: 'boolean'
        },
        autoselect: {
            control: 'boolean'
        },
        disabled: {
            control: 'boolean'
        },
        clearable: {
            control: 'boolean'
        },
        icon: {
            control: 'select',
            options: ['none', 'Search'],
            mapping: {
                'none': null,
                'Search': Search
            },
            description: "Appears first. "
                + "May be used as a prop, or as a slot for more complex icon control. "
                + "In this demo we use a prop."
        },
        modelValue: {
            control: 'text',
            description: "The `model-value` is the `v-model` value of the component."
        },
        name: {
            control: 'text',
            description: "Sets the name attribute of the internal input."
        },
        prefix: {
            control: 'text',
            description: "Appears before the input field but after the `icon`. "
                + "May be used as a prop for a simple text-based prefix, or as a slot for a more complex prefix. "
                + "In this demo we use a prop."
        },
        suffix: {
            control: 'text',
            description: "Appears after the input field. "
                + "May be used as a prop when a text suffix is required, or as a slot for a more complex suffix. "
                + "In this demo we use a prop."
        },
        type: {
            control: 'select',
            options: ['text', 'number', 'search']
        }
    },
    args: {
        autofocus: false,
        autoselect: false,
        clearable: false,
        disabled: false,
        icon: 'none',
        prefix: '',
        suffix: '',
        modelValue: '',
        type: 'text'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTextfield>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTextfield },
        setup() {
            return { args };
        },
        template: '<ev-textfield v-bind="args" v-model="args.modelValue"></ev-textfield>'
    })
};