import type { Meta, StoryObj } from "@storybook/vue3";

import {
    EvDataTableCell,
    EvDataTable,
    EvDataTableRow,
} from "@/components/EvDataTable";
import { EvButton, EvSurface } from "@/components";
import { ref } from "vue";
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
            description: "A search string can be applied",
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
        data() {

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
            const boatsMax = 500;
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

            function generateItems(limit) {
                return [...Array(limit).keys()].map((i) => {
                    const boat = { ...boats[i % boats.length] };
                    boat.id = i + 1;
                    boat.name = `${boat.name} #${i}`;
                    boat.value = `boat-${i + 1}`;
                    return boat;
                });
            }

            const items = ref(generateItems(50));

            async function api(currentItems) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const additional =
                            currentItems.length < boatsMax
                                ? generateItems(50)
                                : [];
                        resolve(additional);
                    }, 1000);
                });
            }

            async function load({ done }) {
                const res = await api(items.value);
                items.value.push(...res);
                if (!res.length) {
                    done("finished");
                } else {
                    done("ok");
                }
            }

            return {
                items,
                sort,
                sortOptions,
                load,
            };
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

            function onSearch(value) {
                console.log(value);
            }

            function onSort(selectedSort) {
                console.log(selectedSort);
            }

            return { args, headers, selected, onSearch, onSort };
        },
        template: `
            <ev-surface scrollable height="600" elevation="panel" rounded="small">
                <ev-data-table
                    v-bind="args" 
                    :items="items" 
                    :headers="headers"
                    :sort-options="sortOptions"
                    v-model="selected"
                    v-model:sort="sort"
                    v-model:search="args.search"
                    @load="load"
                    @update:search="onSearch"
                    @update:sort="onSort"
                >
                    <template #item.price="{ value }">£{{ value }}</template>
                </ev-data-table>
            </ev-surface>
        `,
    }),
};
