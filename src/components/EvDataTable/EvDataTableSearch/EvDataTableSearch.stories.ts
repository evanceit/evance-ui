import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDataTableSearch } from "../EvDataTableSearch";
import { SortOption } from "@/components/EvDataTable/composables/sort.ts";
import { ref } from "vue";

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
            const sortOptions: SortOption[] = [
                {
                    title: "Quickfind",
                    direction: "Ascending",
                    value: "quickfind:asc",
                },
                {
                    title: "Quickfind",
                    direction: "Descending",
                    value: "quickfind:desc",
                },
                {
                    title: "Order Date",
                    direction: "Oldest to Newest",
                    value: "ordered:asc",
                },
                {
                    title: "Order Date",
                    direction: "Newest to Oldest",
                    value: "ordered:desc",
                },
                {
                    title: "Dispatch Date",
                    direction: "A-Z",
                    value: "dispatch:asc"
                },
                {
                    title: "Dispatch Date",
                    direction: "Z-A",
                    value: "dispatch:desc",
                    disabled: true,
                },
                {
                    title: "Relevance",
                    value: "relevance:desc",
                },
            ];
            const sortSelected = ref(["quickfind:desc"]);
            return { args, sortOptions, sortSelected };
        },
        template: `<ev-data-table-search v-bind="args" :sort-options="sortOptions" v-model:sort-selected="sortSelected" /> {{ sortSelected }}`,
    }),
};
