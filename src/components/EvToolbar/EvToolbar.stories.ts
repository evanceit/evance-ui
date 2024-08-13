import type { Meta, StoryObj } from "@storybook/vue3";
import { EvToolbar } from "@/components";

const meta: Meta<typeof EvToolbar> = {
    component: EvToolbar,
    argTypes: {
        title: {
            control: "text",
        },
    },
    args: {
        title: "This is a very long title that will overflow",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvToolbar>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvToolbar },
        setup() {
            return { args };
        },
        template: `<ev-toolbar v-bind="args" />`,
    }),
};
