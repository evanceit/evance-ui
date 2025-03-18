import type { Meta, StoryObj } from "@storybook/vue3";

import {
    EvDataTableCell,
    EvDataTable,
    EvDataTableRow,
} from "@/components/EvDataTable";
import {
    EvButton,
    EvSurface,
    EvCode,
    EvFilterButton,
    EvMenu,
    EvCheckbox,
    EvLozenge,
    EvDivider,
    EvSection,
} from "@/components";
import { ref } from "vue";
import { SortOption } from "@/components/EvDataTable/composables/sort";
import { EllipsisIcon } from "@/icons";

const meta: Meta<typeof EvDataTable> = {
    component: EvDataTable,
    argTypes: {
        filters: {
            control: false,
            description:
                "The `filters` prop is matched with a `filters` slot. The prop should be an object whose properties represent filtered values as either an array, string, boolean or number. " +
                "Changes in filters will automatically trigger a `load` event. " +
                "The data table does not directly manipulate filters, nor render them (use the `filters` slot to render filters). " +
                "However, it will use the `filters` prop to determine if any filters have been applied.",
        },
        headers: {
            control: false,
            description:
                "An array of objects that each describe a column (see below)",
        },
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
        itemsPerPage: {
            control: false,
            description:
                "The number of items you are displaying per page - used internally to determine when a `load` event " +
                "reaches the end of the list. Defaults to `50`.",
        },
        itemValue: {
            control: "select",
            options: ["id", "value"],
            description:
                "Property on supplied `items` that contains its value. Defaults to `id`.",
        },
        load: {
            control: false,
            description: `<p>The <code>load</code> event is triggered when:</p>
            <ul>
                <li>Loading the next page of results on scroll.</li>
                <li><code>search</code> string changes (after <code>search-delay</code>)</li>
                <li>The <code>sort</code> value changes</li>
            </ul>
            <p>The load event provides the following parameters:</p>
            <ul>
                <li><code>page</code> - the pagination page expected to load.</li>
                <li><code>next</code> - a function to provide the next array of <code>items</code>. 
                This automatically handles loading state, current page updates, 
                scroll position, end of list state and empty state.</li>
            </ul>
            `,
        },
        loading: {
            control: "boolean",
            description:
                "Sets the table into a loading state. This disabled infinite scroll events.",
        },
        modelValue: {
            control: false,
            description:
                "Maintains a list of selected item values (see `item-value`), or the item objects when `return-object` is `true`.",
        },
        page: {
            control: false,
            description:
                "The current page of data used in pagination. This should be applied with `v-model:page` or tracked with `@update:page`. " +
                "For simple tables, it may not be necessary to apply the page prop when using the native functions provided by the `@load` event. " +
                "Defaults to `1`.",
        },
        reload: {
            control: false,
            description:
                "An exposed method allowing you to manually trigger the `load` event - forcing load to page `1`. " +
                "This is useful if you have additional external parameters affecting table data.",
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
        selectActions: {
            control: false,
            description:
                "Actions available when one or more items are selected. Accepts an array of `EvButtonProps`. " +
                "For greater flexibility use the `select-actions` slot.",
        },
        selectStrategy: {
            control: "select",
            options: ["single", "page", "all"],
            description: `<p>Selection strategy:</p>
                <ul>
                    <li><code>single</code></li>
                    <li><code>page</code></li>
                    <li><code>all</code></li>
                </ul>
            `,
        },
        showHeaders: {
            control: "boolean",
            description:
                "Whether to show the `thead` headers for the table. Defaults to `false`.",
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
            description: `<p>An array of <code>SortOption</code> items with the following properties:</p>
                <ul>
                    <li><code>title</code> - the text title to display to the user.</li>
                    <li><code>value</code> - a string value to use in your API (must end with either <code>asc</code> or <code>desc</code>).</li>
                    <li><code>direction</code> (optional) - the text to display in direction selection (defaults to Ascending or Descending).</li>
                    <li><code>disabled</code> (optional) - a boolean when set to true disabled option selection</li>
                </ul>
                <p>If no options are supplied sorting will not be shown.</p>
            `,
        },
    },
    args: {
        filters: undefined,
        headers: undefined,
        height: "100%",
        items: undefined,
        itemsPerPage: undefined,
        itemValue: "id",
        load: undefined,
        loading: undefined,
        modelValue: undefined,
        page: undefined,
        reload: undefined,
        returnObject: undefined,
        search: "",
        searchDelay: undefined,
        searchPlaceholder: undefined,
        selectActions: undefined,
        selectStrategy: "page",
        showHeaders: false,
        showSelect: false,
        sort: undefined,
        sortOptions: undefined,
    },
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
            EvCode,
            EvFilterButton,
            EvMenu,
            EvCheckbox,
            EvLozenge,
            EvDivider,
            EvSection,
        },
        setup() {
            const headers = [
                {
                    title: "Name",
                    key: "name",
                    align: "start",
                },
                {
                    title: "Speed (km/h)",
                    key: "speed",
                    align: "center",
                    hidden: { xs: "only" },
                    width: 120,
                },
                {
                    title: "Length (m)",
                    key: "length",
                    align: "center",
                    hidden: { sm: "down" },
                    width: 120,
                },
                {
                    title: "Year of Reg.",
                    key: "year",
                    align: "center",
                    hidden: { md: "down" },
                    width: { xs: 120, lg: 150 },
                },
                {
                    title: "Price",
                    key: "price",
                    align: "end",
                    width: 120,
                },
                {
                    title: "",
                    key: "actions",
                    align: "end",
                    width: 52,
                    cellProps: {
                        class: "py-0",
                    },
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

            async function load({ next, page }) {
                const results = await api(page > 1 ? items.value : []);
                next(results);
            }

            const selectActions = [
                {
                    text: "Action 1",
                    onClick: () => {
                        console.log("action 1");
                    },
                },
                {
                    text: "Action 2",
                    onClick: () => {
                        console.log("action 2");
                    },
                },
            ];

            const filters = ref({
                status: [],
                assignee: [],
            });

            return {
                args,
                headers,
                selected,
                items,
                sort,
                sortOptions,
                load,
                itemsPerPage,
                EllipsisIcon,
                selectActions,
                filters,
            };
        },
        template: `
            <ev-surface scrollable height="600" elevation="panel" rounded="small">
                <ev-data-table
                    v-bind="args" 
                    v-model:items="items"
                    v-model="selected"
                    v-model:sort="sort"
                    v-model:search="args.search"
                    :headers="headers"
                    :select-actions="selectActions"
                    :sort-options="sortOptions"
                    :items-per-page="itemsPerPage"
                    :filters="filters"
                    @load="load">
                    <template #filters>
                        <ev-filter-button id="statusMenu" title="Status" v-model="filters.status" />
                        <ev-menu activator="#statusMenu" :close-on-content-click="false" position="bottom-end">
                            <ev-surface elevation="overlay" width="250">
                                <ev-section title="Status">
                                    <div class="px-100">
                                        <ev-checkbox :value="{ title: 'Pending', value: 'pending', id: 1 }" v-model="filters.status">
                                            <template #label>
                                                <ev-lozenge>Pending</ev-lozenge>
                                            </template>
                                        </ev-checkbox>
                                        <ev-checkbox :value="{ title: 'Active', value: 'active', id: 2 }" v-model="filters.status">
                                            <template #label>
                                                <ev-lozenge appearance="success">Active</ev-lozenge>
                                            </template>
                                        </ev-checkbox>
                                    </div>
                                </ev-section>
                                <ev-divider />
                                <div v-if="filters.status.length" class="pa-50">
                                    <ev-button variant="subtle" full-width @click="filters.status = []">Clear all</ev-button>
                                </div>
                            </ev-surface>
                        </ev-menu>
                        
                        <ev-filter-button id="assigneeMenu" title="Assignee" v-model="filters.assignee" filter-title="name" />
                        <ev-menu activator="#assigneeMenu" :close-on-content-click="false" position="bottom-end">
                            <ev-surface elevation="overlay" width="250">
                                <ev-section title="Users">
                                    <div class="px-100">
                                        <ev-checkbox :value="{ name: 'Current user', id: 123 }" v-model="filters.assignee" label="Current user" />
                                        <ev-checkbox :value="{ name: 'Locale manager', id: 124 }" v-model="filters.assignee" label="Locale manager" />
                                    </div>
                                </ev-section>
                            </ev-surface>
                        </ev-menu>
                    </template>
                    <template #header.speed="{ header }">Speed <ev-code>km/h</ev-code></template>
                    <template #header.length="{ header }">Length <ev-code>m</ev-code></template>
                    <template #item.price="{ value }">£{{ value }}</template>
                    <template #item.actions="props">
                        <ev-button size="small" :icon="EllipsisIcon" variant="subtle" rounded  />
                    </template>
                </ev-data-table>
            </ev-surface>
        `,
    }),
};
