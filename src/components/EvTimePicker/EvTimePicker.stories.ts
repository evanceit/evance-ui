import type { Meta, StoryObj } from "@storybook/vue3";
import { EvTimePicker } from "@/components";


const meta: Meta<typeof EvTimePicker> = {
    component: EvTimePicker,
    title: "Components/Actions/EvTimePicker",
    argTypes: {
        hourFormat: {
            control: "select",
            options: [undefined, 12, 24],
        },
    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTimePicker>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTimePicker },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: null,
            };
        },
        template: `
            <p>Model value: {{ modelValue }}</p>
            <button @click="modelValue = '10:45'">Set time to 10:45</button>
            <ev-time-picker v-bind="args" v-model="modelValue" />`,
    }),
};
