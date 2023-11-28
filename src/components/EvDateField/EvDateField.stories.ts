import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDateField } from "../EvDateField";
import {ref} from "vue";

const meta: Meta<typeof EvDateField> = {
    component: EvDateField,
    argTypes: {
        min: {
            control: 'text',
            description: 'The minimum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.'
        },
        max: {
            control: 'text',
            description: 'The maximum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.'
        },
        'selection-mode': {
            control: "select",
            options: ['single', 'multiple', 'range']
        },
        'show-adjacent-months': {
            control: "boolean"
        }
    },
    args: {
        min: null,
        max: null,
        'selection-mode': 'single',
        'show-adjacent-months': true,
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
        template: `"{{ modelValue }}"<ev-date-field v-bind="args" v-model="modelValue" />`
    })
};