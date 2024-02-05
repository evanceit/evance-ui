import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDateField } from "../EvDateField";
import {ref} from "vue";
import {omit} from "../../util";

import EvTextfieldStories from "@/components/EvTextfield/EvTextfield.stories.ts";
import EvDatePickerStories from "@/components/EvDatePicker/EvDatePicker.stories.ts";

const meta: Meta<typeof EvDateField> = {
    component: EvDateField,
    title: 'Forms/EvDateField',
    argTypes: {
        ...omit(EvTextfieldStories.argTypes as any, [
            'icon-start',
            'type'
        ]),
        ...EvDatePickerStories.argTypes
    },
    args: {
        ...omit(EvTextfieldStories.args as any, [
            'icon-start',
            'type'
        ]),
        ...EvDatePickerStories.args as any
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDateField>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDateField },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: ref(null)
            }
        },
        template: `<p>Selected date: "{{ modelValue }}"</p>
        <ev-date-field v-bind="args" v-model="modelValue" />`
    })
};