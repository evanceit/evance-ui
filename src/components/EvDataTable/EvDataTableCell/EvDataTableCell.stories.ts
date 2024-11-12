import type { Meta, StoryObj } from "@storybook/vue3";

import {
    EvDataTableCell,
    EvDataTable,
    EvDataTableRow,
} from "@/components/EvDataTable";

const meta: Meta<typeof EvDataTableCell> = {
    component: EvDataTableCell,
    argTypes: {
        align: {
            control: "select",
            options: [undefined, "start", "center", "end"],
            description: "Text alignment within the cell. Defaults to `start`.",
        },
        colspan: {
            control: "number",
            description: "The number of columns the cell should span",
        },
        default: {
            description: "The default slot.",
        },
        noPadding: {
            control: "boolean",
            description: "Removes padding from the cell",
        },
        width: {
            control: "number",
            description: "",
        },
    },
    args: {
        align: undefined,
        colspan: undefined,
        noPadding: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableCell>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDataTableCell, EvDataTable, EvDataTableRow },
        data() {
            const items = [];
            return {
                items,
            };
        },
        setup() {
            return { args };
        },
        template: `
            <table>
                <tr>
                    <ev-data-table-cell v-bind="args">
                        Content here
                    </ev-data-table-cell>
                    <ev-data-table-cell>
                        Default no mods.
                    </ev-data-table-cell>
                </tr>
            </table>
        `,
    }),
};
