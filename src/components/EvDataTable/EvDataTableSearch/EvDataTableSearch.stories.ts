import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDataTableSearch } from "../EvDataTableSearch";

const meta: Meta<typeof EvDataTableSearch> = {
    component: EvDataTableSearch,
    argTypes: {
        selectable: {
            control: "boolean",
        },
    },
    args: {
        selectable: true,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableSearch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDataTableSearch },
        setup() {
            return { args };
        },
        template: `<ev-data-table-search v-bind="args" />`,
    }),
};
