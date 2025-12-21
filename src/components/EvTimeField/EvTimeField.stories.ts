import type { Meta, StoryObj } from "@storybook/vue3";
import { EvTimeField } from "@/components";


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
        components: { EvTimeField },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: null,
            };
        },
        template: `
            <ev-time-field v-bind="args" v-model="modelValue" />
        `,
    }),
};
