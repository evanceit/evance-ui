import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDateField } from "../EvDateField";
import { reactive, ref } from "vue";
import { omit } from "@/util";

import EvTextfieldStories from "@/components/EvTextfield/EvTextfield.stories";
import EvDatePickerStories from "@/components/EvDatePicker/EvDatePicker.stories";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvButton } from "@/components/EvButton";
import { EvForm } from "../EvForm";

const meta: Meta<typeof EvDateField> = {
    component: EvDateField,
    title: "Components/Forms/EvDateField",
    argTypes: {
        ...omit(EvTextfieldStories.argTypes as any, ["iconStart", "type"]),
        ...EvDatePickerStories.argTypes,
    },
    args: {
        ...omit(EvTextfieldStories.args as any, ["iconStart", "type"]),
        ...(EvDatePickerStories.args as any),
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDateField>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDateField, EvButtonGroup, EvButton },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: ref("2025-12-20"),
            };
        },
        template: `
            <p>Selected date: "{{ modelValue }}"</p>
            
            <ev-date-field v-bind="args" v-model="modelValue" @select="(v) => console.log(v)" />

            <br />
            <ev-button-group class="mb-200">
                <ev-button @click="modelValue = '2025-12-20'">Set date to 2025-12-20</ev-button>
                <ev-button @click="modelValue = new Date()">Set to now</ev-button>
                <ev-button @click="modelValue = '2025-12-20 19:30:00'">2025-12-20 19:30:00</ev-button>
                <ev-button @click="modelValue = '2026-04-26T15:10:58+01:00'">2026-04-26T15:10:58+01:00</ev-button>
                <ev-button @click="modelValue = null">Clear</ev-button>
            </ev-button-group>
        `,
    }),
};

export const ExampleInForm: Story = {
    render: (args: any) => ({
        components: { EvDateField, EvForm },
        setup() {

            const formData = reactive({
                expires: null,
            });

            return { formData };
        },
        template: `
            <ev-form :data="formData">
                <ev-date-field name="expires" />
            </ev-form>
            
            {{ formData }}
        `,
    }),
};
