import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDataTableSearch } from "../EvDataTableSearch";
import { SortOption } from "@/components/EvDataTable/composables/sort.ts";
import { ref, shallowRef } from "vue";
import { EvButton } from "@/components";

const meta: Meta<typeof EvDataTableSearch> = {
    component: EvDataTableSearch,
    argTypes: {
        selectable: {
            control: "boolean",
        },
        sort: {
            description:
                "The currently selected sort choice. Required if using sorting. " +
                "Accepts a `string[]` with a single value, which must be an available `value` in `sort-options`.",
        },
        sortOptions: {
            description: `An array of \`SortOption\` items with the following properties:
                <ul>
                    <li>\`title\` - the text title to display to the user.</li>
                    <li>\`value\` - a string value to use in your API (must end with either \`asc\` or \`desc\`).</li>
                    <li>\`direction\` (optional) - the text to display in direction selection (defaults to Ascending or Descending).</li>
                    <li>\`disabled\` (optional) - a boolean when set to true disabled option selection</li>
                </ul>
                If no options are supplied sorting will not be shown.
            `,
        },
        "update:sort": {
            description: "Triggered when the sort value changes.",
        },
        placeholder: {
            control: "text",
            description: "What to display in the search field when empty.",
        },
    },
    args: {
        sort: undefined,
        placeholder: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableSearch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDataTableSearch, EvButton },
        data() {
            const sort = ref(["quickfind:desc"]);
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
            const search = shallowRef("");

            return {
                sort,
                sortOptions,
                search,
            };
        },
        setup() {
            return { args };
        },
        methods: {
            onSort(value) {
                console.log("The Sort value was updated: ", value);
            },
            onClickFilter(value) {
                console.log(value);
            },
        },
        template: `
        <ev-data-table-search 
            v-bind="args"
            v-model:search="search"
            v-model:sort="sort"
            :sort-options="sortOptions" 
            @click:filter="onClickFilter"
            @update:sort="onSort" />`,
    }),
};
