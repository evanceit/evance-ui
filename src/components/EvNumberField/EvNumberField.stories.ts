import type {Meta, StoryObj} from "@storybook/vue3";

import { EvNumberField } from "../EvNumberField";
import {omit} from "../../util";

import EvTextfieldStories from "../EvTextfield/EvTextfield.stories.ts";

const meta: Meta<typeof EvNumberField> = {
    component: EvNumberField,
    title: 'Forms/EvNumberField',
    argTypes: {
        ...omit(EvTextfieldStories.argTypes, [
            'type'
        ])
    },
    args: {
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