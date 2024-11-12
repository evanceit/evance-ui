import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDataTableRow } from "../EvDataTableRow";
import { EvDataTable } from "@/components/EvDataTable";

const meta: Meta<typeof EvDataTableRow> = {
    component: EvDataTableRow,
    argTypes: {
        selectable: {
            control: "boolean",
        },
    },
    args: {
        selectable: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableRow>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDataTable, EvDataTableRow },
        setup() {
            return { args };
        },
        template: `
            <table>
                <ev-data-table-row v-bind="args" />
            </table>`,
    }),
};
