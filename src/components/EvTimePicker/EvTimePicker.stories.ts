import type { Meta, StoryObj } from "@storybook/vue3";
import { EvTimePicker } from "@/components";


const meta: Meta<typeof EvTimePicker> = {
    component: EvTimePicker,
    title: "Components/Actions/EvTimePicker",
    argTypes: {

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
        template: `<ev-time-picker
            v-bind="args" />`,
    }),
};
