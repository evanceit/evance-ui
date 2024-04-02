import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSelect } from "../EvSelect";
import {InputAppearance} from "../../util";
import {Search} from "../../icons";

const meta: Meta<typeof EvSelect> = {
    component: EvSelect,
    title: 'Forms/EvSelect',
    argTypes: {
        // Form Field Attributes
        disabled: {
            control: 'boolean',
            description: 'Removes the ability to click or target the input.'
        },
        error: {
            control: 'boolean',
            description: 'Puts the input in a manual error state.'
        },
        id: {
            control: 'text',
            description: 'The ID associated with the form field and the component wrapper'
        },
        label: {
            control: 'text',
            description: 'Optional label - may be supplied as a prop or within a slot.'
        },
        modelValue: {
            description: "The `model-value` is the `v-model` value of the component."
        },
        name: {
            control: 'text',
            description: "Sets the name attribute of the internal input."
        },
        placeholder: {
            control: 'text',
        },
        readonly: {
            control: 'boolean'
        },
        validateOn: {
            control: 'select',
            description: 'Change what type of event triggers validation to run.',
            options: ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy']
        },
        validators: {
            description: 'An array of validator functions, which evaluate an input value ' +
                'as an argument and must return either true or a string containing an error message. ' +
                'The input field will enter an error state if a function returns'
        },
        // End

        appearance: {
            control: 'select',
            options: Object.values(InputAppearance)
        },
        clearable: {
            control: 'boolean'
        },
        iconStart: {
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
        noItemsText: {
            control: 'text',
            description: "Change the text that appears when no items are available, or use the `no-items` slot. Defaults to the `select.noItemsText` locale translation path."
        },
        openOnClear: {
            control: 'boolean'
        },
        prefix: {
            control: 'text',
            description: "Appears before the input field but after the `icon`. "
                + "May be used as a prop for a simple text-based prefix, or as a slot for a more complex prefix. "
                + "In this demo we use a prop."
        },
        returnObject: {
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
        // Form Field Args
        disabled: false,
        error: false,
        id: undefined,
        modelValue: undefined,
        name: undefined,
        readonly: false,
        validateOn: 'input',
        validators: undefined,
        // End

        appearance: InputAppearance.default,
        clearable: false,
        iconStart: 'none',
        label: undefined,
        multiple: false,
        openOnClear: false,
        placeholder: undefined,
        returnObject: false,
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
            return {
                selected: null
            }
        },
        setup() {

            const items = [];
            for (let i = 0; i < 1000; i++) {
                const num = i + 1;
                items.push({
                    title: `Example Test Item ${num}`,
                    value: num
                });
            }

            const requiredValidator = (value: any) => {
                if (!value) {
                    return 'Required';
                }
                return true;
            };

            return { args, items, requiredValidator };
        },
        template: `<ev-select v-bind="args" v-model="selected" :items="items" :validators="[requiredValidator]" />`
    })
};