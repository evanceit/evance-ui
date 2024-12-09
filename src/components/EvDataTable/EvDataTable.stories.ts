import type { Meta, StoryObj } from "@storybook/vue3";

import {
    EvDataTableCell,
    EvDataTable,
    EvDataTableRow,
} from "@/components/EvDataTable";
import { EvButton, EvSurface } from "@/components";
import { ref, shallowRef } from "vue";
import { SortOption } from "@/components/EvDataTable/composables/sort.ts";

const meta: Meta<typeof EvDataTable> = {
    component: EvDataTable,
    argTypes: {
        height: {
            control: "select",
            options: [null, 400, 500, "100%"],
            description: "Optional height of the overall table",
        },
        items: {
            control: false,
            description:
                "An array of strings or objects used for automatically generating table rows and cells.",
        },
        itemValue: {
            control: "select",
            options: ["id", "value"],
            description:
                "Property on supplied `items` that contains its value.",
        },
        loading: {
            control: "boolean",
            description: "Sets the table into a loading state.",
        },
        returnObject: {
            control: "boolean",
            description:
                "Changes the selection behavior to return the object directly rather than the value specified with `item-value`.",
        },
        search: {
            control: "text",
            description:
                "A search string value used to filter results available as a `v-model:search` and/or `@update:search`.",
        },
        searchDelay: {
            control: "number",
            description:
                "Adds a delay in ms between search input and `search` model updates. Defaults to `300`. " +
                "The delay helps reduce the number of search requests.",
        },
        searchPlaceholder: {
            control: "text",
            description:
                "The placeholder to show in the search field when empty",
        },
        selectStrategy: {
            control: "select",
            options: ["single", "page", "all"],
            description: `Selection strategy:
                <ul>
                    <li>\`single\`</li>
                    <li>\`page\`</li>
                    <li>\`all\`</li>
                </ul>
            `,
        },
        showSelect: {
            control: "boolean",
            description:
                "Shows the select checkboxes in both the header and rows",
        },
        sort: {
            control: false,
            description:
                "The currently selected sort choice. Required if using sorting. " +
                "Accepts a `string[]` with a single value, which must be an available `value` in `sort-options`.",
        },
        sortOptions: {
            control: false,
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
    },
    args: {
        height: "100%",
        itemValue: "id",
        search: "",
        searchDelay: undefined,
        searchPlaceholder: undefined,
        showSelect: false,
        selectStrategy: "page",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableCell>;

export const Primary: Story = {
    render: (args: any) => ({
        components: {
            EvSurface,
            EvDataTableCell,
            EvDataTable,
            EvDataTableRow,
            EvButton,
        },
        setup() {
            const headers = [
                {
                    title: "Name",
                    value: "name",
                },
                {
                    title: "Data",
                    children: [
                        {
                            title: "Speed (km/h)",
                            value: "speed",
                        },
                        {
                            title: "Length (m)",
                            value: "length",
                        },
                        {
                            title: "Year of Reg.",
                            value: "year",
                        },
                    ],
                },
                {
                    title: "Price",
                    value: "price",
                },
            ];
            const selected = ref([]);
            const boats = [
                {
                    name: "Speedster",
                    speed: 35,
                    length: 22,
                    price: 300000,
                    year: 2021,
                },
                {
                    name: "OceanMaster",
                    speed: 25,
                    length: 35,
                    price: 500000,
                    year: 2020,
                },
                {
                    name: "Voyager",
                    speed: 20,
                    length: 45,
                    price: 700000,
                    year: 2019,
                },
                {
                    name: "WaveRunner",
                    speed: 40,
                    length: 19,
                    price: 250000,
                    year: 2022,
                },
                {
                    name: "SeaBreeze",
                    speed: 28,
                    length: 31,
                    price: 450000,
                    year: 2018,
                },
                {
                    name: "HarborGuard",
                    speed: 18,
                    length: 50,
                    price: 800000,
                    year: 2017,
                },
                {
                    name: "SlickFin",
                    speed: 33,
                    length: 24,
                    price: 350000,
                    year: 2021,
                },
                {
                    name: "StormBreaker",
                    speed: 22,
                    length: 38,
                    price: 600000,
                    year: 2020,
                },
                {
                    name: "WindSail",
                    speed: 15,
                    length: 55,
                    price: 900000,
                    year: 2019,
                },
                {
                    name: "FastTide",
                    speed: 37,
                    length: 20,
                    price: 280000,
                    year: 2022,
                },
            ];
            const boatsMax = 200;
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
                    value: "dispatch:asc",
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
            const itemsPerPage = 50;
            const currentPage = shallowRef(1);

            function generateItems(from: number, limit: number) {
                return [...Array(limit).keys()].map((i) => {
                    const id = ++from;
                    const boat = {
                        id: id,
                        value: `boat-${id + 1}`,
                        ...boats[i % boats.length],
                    };
                    boat.name = `${boat.name} #${id}`;
                    return boat;
                });
            }

            const items = ref(generateItems(0, itemsPerPage));

            async function api(currentItems): Promise<any[]> {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const additional =
                            currentItems.length < boatsMax
                                ? generateItems(
                                      currentItems.length,
                                      itemsPerPage,
                                  )
                                : [];
                        resolve(additional);
                    }, 1000);
                });
            }

            async function load({ done, next, page }) {
                const results = await api(items.value);
                results.length ? next(results) : done();
            }

            async function change({ next }) {
                const results = await api([]);
                next(results);
            }

            return {
                args,
                headers,
                selected,
                change,
                items,
                sort,
                sortOptions,
                load,
                currentPage,
            };
        },
        template: `
            <ev-surface scrollable height="600" elevation="panel" rounded="small">
                <ev-data-table
                    v-bind="args" 
                    v-model:items="items"
                    v-model:page="currentPage"
                    v-model="selected"
                    v-model:sort="sort"
                    v-model:search="args.search"
                    :headers="headers"
                    :sort-options="sortOptions"
                    @load="load"
                    @change="change"
                >
                    <template #item.price="{ value }">£{{ value }}</template>
                </ev-data-table>
            </ev-surface>
        `,
    }),
};
