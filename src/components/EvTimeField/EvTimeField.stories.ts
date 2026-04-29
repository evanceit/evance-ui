import type { Meta, StoryObj } from "@storybook/vue3";
import { EvTimeField, EvButton, EvButtonGroup } from "@/components";


const meta: Meta<typeof EvTimeField> = {
    component: EvTimeField,
    title: "Components/Forms/EvTimeField",
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTimeField>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTimeField, EvButton, EvButtonGroup },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: new Date(),
            };
        },
        template: `
            <p>Model value: {{ modelValue }}</p>
            
            <ev-time-field v-bind="args" v-model="modelValue" @select="(v) => console.log('Selected time:', v)" />

            <br />
            <ev-button-group class="mb-200">
                <ev-button @click="modelValue = '10:45'">Set time to 10:45</ev-button>
                <ev-button @click="modelValue = new Date()">Set to now</ev-button>
                <ev-button @click="modelValue = '2025-12-20 19:30:00'">2025-12-20 19:30:00</ev-button>
                <ev-button @click="modelValue = '2026-04-26T15:10:58+01:00'">2026-04-26T15:10:58+01:00</ev-button>
                <ev-button @click="modelValue = null">Clear</ev-button>
            </ev-button-group>
        `,
    }),
};
