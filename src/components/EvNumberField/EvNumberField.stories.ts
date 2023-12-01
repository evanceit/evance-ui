import type {Meta, StoryObj} from "@storybook/vue3";

import { EvNumberField } from "../EvNumberField";
import {omit} from "@/util";

import EvTextfieldStories from "../EvTextfield/EvTextfield.stories.ts";

const meta: Meta<typeof EvNumberField> = {
    component: EvNumberField,
    title: 'Forms/EvNumberField',
    argTypes: {
        min: {
            control: 'number',
            description: "The minimum boundary number."
        },
        max: {
            control: 'number',
            description: "The maximum boundary number."
        },
        step: {
            control: 'number',
            description: "The amount to increment when the +/- buttons are pressed."
        },
        modelValue: {
            control: 'number',
            description: "The `model-value` is the `v-model` value of the component."
        },
        ...omit(EvTextfieldStories.argTypes, [
            'modelValue',
            'type'
        ])
    },
    args: {
        min: undefined,
        max: undefined,
        step: undefined,

        ...omit(EvTextfieldStories.args, [
            'type'
        ])
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvNumberField>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvNumberField },
        setup() {
            return { args };
        },
        template: `<ev-number-field v-bind="args" />`
    })
};