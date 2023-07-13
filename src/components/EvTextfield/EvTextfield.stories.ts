import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTextfield } from "../EvTextfield";
import {Search} from "../../icons";
import {InputAppearance, InputSize} from "../../util";

const meta: Meta<typeof EvTextfield> = {
    component: EvTextfield,
    title: 'Forms/EvTextfield',
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(InputAppearance)
        },
        autofocus: {
            control: 'boolean'
        },
        autoselect: {
            control: 'boolean',
            description: "When `autoselect` is `true` any text within the input is selected on focus."
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
            description: "Appears before input prefix. "
        },
        loading: {
            control: 'boolean',
            description: "When `loading` is `true` a linear progress bar is added to the bottom of the textfield " +
                "in an indeterminate state. However, if an `icon` has been set, a circular progress progress bar " +
                "is used instead."
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
        rounded: {
            control: 'boolean',
        },
        size: {
            control: 'select',
            options: Object.values(InputSize)
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
        appearance: InputAppearance.default,
        autofocus: false,
        autoselect: false,
        clearable: false,
        disabled: false,
        icon: 'none',
        loading: false,
        prefix: '',
        rounded: false,
        size: InputSize.default,
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
        template: '<ev-textfield v-bind="args"></ev-textfield>'
    })
};