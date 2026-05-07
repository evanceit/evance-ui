import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSelect } from "@/components/EvSelect";
import { EvListItem } from "@/components/EvListItem";
import { EvDivider } from "@/components/EvDivider";
import { EvLozenge } from "@/components/EvLozenge";
import EvTextfieldStories from "@/components/EvTextfield/EvTextfield.stories";
import { omit } from "@/util";
import { PlusIcon, ProductsIcon } from "@/icons";
import {
    EvAvatar,
    EvBlock,
    EvButton,
    EvLayout,
    EvQuickfind,
} from "@/components";
import {reactive, ref, shallowRef} from "vue";
import {EvForm} from "../EvForm";

const meta: Meta<typeof EvSelect> = {
    component: EvSelect,
    title: "Components/Forms/EvSelect",
    argTypes: {
        behavior: {
            control: "select",
            options: ["select", "autocomplete", "combobox"],
            description: "",
        },
        hideItemsEmpty: {
            control: "boolean",
            description:
                "Hides the menu when there are no items to show. Useful for preventing the menu from opening " +
                "before results are fetched asynchronously. " +
                "Also has the effect of opening the menu when the items array changes if not already open.",
        },
        hideSelected: {
            control: "boolean",
            description:
                "Do not display in the select menu items that are already selected.",
        },
        items: {
            description:
                "An array of strings or objects. By default objects should have `title` (see `item-title`) and " +
                "`value` (see `item-value`) properties, and can optionally have a `props` property containing any " +
                "`EvListItem` props.",
        },
        itemTitle: {
            description:
                "Property on supplied items that contains its title. Defaults to 'title'.",
        },
        itemValue: {
            description:
                "Property on supplied items that contains its value - must be a primitive. Defaults to 'value'.",
        },
        itemsEmptyText: {
            control: "text",
            description:
                "Change the text that appears when no items are available, or use the `no-items` slot. Defaults to the `select.noItemsText` locale translation path.",
        },
        modelValue: {
            description:
                "The `model-value` is the `v-model` value of the component.",
        },
        multiple: {
            control: "boolean",
        },
        openOnClear: {
            control: "boolean",
        },
        returnObject: {
            control: "boolean",
            description:
                "When `true` the `v-model` bound to the EvSelect will receive the full item instead of the item's value.",
        },
        tags: {
            control: "boolean",
            description: "Selections are shown as an `<ev-tag>`. ",
        },

        ...omit(EvTextfieldStories.argTypes as any, [
            "align",
            "iconEnd",
            "modelValue",
            "monospace",
            "type",
        ]),
    },
    args: {
        behavior: "select",
        modelValue: undefined,
        multiple: false,
        hideItemsEmpty: false,
        hideSelected: false,
        itemsEmptyText: undefined,
        openOnClear: false,
        returnObject: false,
        tags: false,

        ...omit(EvTextfieldStories.args as any, [
            "align",
            "iconEnd",
            "modelValue",
            "monospace",
            "type",
        ]),
    },
};

export default meta;

type Story = StoryObj<typeof EvSelect>;

/**
 * ## generateItemList
 * @param amount
 */
function generateItemList(amount: number) {
    const items = [];
    for (let i = 0; i < amount; i++) {
        const num = i + 1;
        items.push({
            title: `${num}. Example Test Item ${num}`,
            value: num,
            id: num,
            sku: "EX-PID-" + num,
            image: `https://picsum.photos/id/1${i + 1}/36/36`,
        });
    }
    return items;
}

/**
 * ## Primary Story
 */
export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSelect },
        data() {
            return {
                selected: null,
            };
        },
        setup() {
            const items = generateItemList(1000);

            const requiredValidator = (value: any) => {
                if (!value) {
                    return "Required";
                }
                return true;
            };

            return { args, items, requiredValidator };
        },
        template: `<ev-select v-bind="args" v-model="selected" :items="items" :validators="[requiredValidator]" />`,
    }),
};

/**
 * ## Items Affix Story
 */
export const ItemsAffix: Story = {
    render: (args: any) => ({
        components: { EvSelect, EvListItem, EvDivider },
        data() {
            return {
                selected: null,
            };
        },
        setup() {
            const items = generateItemList(10);
            return { items, PlusIcon };
        },
        template: `
            <ev-select :items="items">
                <template #items-prefix>
                    <ev-list-item>Available items</ev-list-item>
                    <ev-divider />
                </template>
                <template #items-suffix>
                    <ev-divider />
                    <ev-list-item :icon-start="PlusIcon" :link="true">Add a new item</ev-list-item>
                </template>
            </ev-select>
            `,
    }),
};

/**
 * ## List Affix Story
 */
export const ListAffix: Story = {
    render: (args: any) => ({
        components: { EvSelect, EvListItem, EvDivider },
        data() {
            return {
                selected: null,
            };
        },
        setup() {
            const items = generateItemList(100);
            return { items, PlusIcon };
        },
        template: `
            <ev-select :items="items">
                <template #list-prefix>
                    <ev-list-item>Available items</ev-list-item>
                    <ev-divider />
                </template>
                <template #list-suffix>
                    <ev-divider />
                    <ev-list-item :icon-start="PlusIcon" :link="true">Add a new item</ev-list-item>
                </template>
            </ev-select>
            `,
    }),
};

/**
 * ## Custom Item Story
 */
export const CustomItem: Story = {
    render: (args: any) => ({
        components: {
            EvSelect,
            EvListItem,
            EvDivider,
            EvLozenge,
            EvLayout,
            EvBlock,
            EvAvatar,
            EvQuickfind,
        },
        setup() {
            const items = generateItemList(10);
            return { items, ProductsIcon };
        },
        template: `
            <ev-select
                clearable
                open-on-clear
                behavior="autocomplete"
                :items="items"
                placeholder="Search for a product"
                >
                <template #placeholder>
                    <ev-layout align="center" gutter="100">
                        <ev-block size="auto">
                            <ev-avatar :icon="ProductsIcon"></ev-avatar>
                        </ev-block>
                        <ev-block size="grow">
                            <span class="text-large">No Product selected</span>
                            <br />
                            Click here to search & select
                        </ev-block>
                    </ev-layout>
                </template>
                <template #selection="{ item, index }">
                    <ev-layout align="center" gutter="100">
                        <ev-block size="auto">
                            <ev-avatar :image="item.raw.image"></ev-avatar>
                        </ev-block>
                        <ev-block size="grow">
                            <span class="text-large">{{ item.raw.title }}</span>
                            <br />
                            SKU: {{ item.raw.sku }}
                            <ev-quickfind size="small" v-model="item.raw.id"></ev-quickfind>
                        </ev-block>
                        <ev-block size="auto">
                            <ev-lozenge appearance="success">Active</ev-lozenge>
                        </ev-block>
                    </ev-layout>
                </template>
                <template #item="{item, index, props}">
                    <ev-list-item v-bind="props">
                        <template #prefix>
                            <ev-avatar :image="item.raw.image"></ev-avatar>
                        </template>
                        <template #default>
                            <span class="text-large">{{ item.raw.title }}</span>
                            <br />
                            SKU: {{ item.raw.sku }}
                            <ev-quickfind v-model="item.raw.id"></ev-quickfind>
                        </template>
                        <template #suffix>
                            <ev-lozenge appearance="success">Active</ev-lozenge>
                        </template>
                    </ev-list-item>
                </template>
            </ev-select>
            `,
    }),
};

/**
 * ## Customizing empty list
 */
export const ItemsEmpty: Story = {
    render: (args: any) => ({
        components: { EvSelect, EvListItem, EvButton },
        data() {
            return {
                selected: null,
            };
        },
        setup() {
            const items: any[] = [];
            return { items, PlusIcon };
        },
        template: `
            <ev-select :items="items">
                <template #items-empty>
                    <div style="padding: 2rem; text-align: center">
                        <h4>Oops, no items</h4>
                        <p>You don't have any items, would you like to add one?</p>
                        <ev-button :icon-start="PlusIcon" size="small">Add item</ev-button>
                    </div>
                </template>
            </ev-select>
            `,
    }),
};

/**
 * ## Async Items
 */
export const ServerSideAutocompleteWithSelectionCache: Story = {
    render: (args: any) => ({
        components: { EvSelect, EvListItem, EvButton, EvForm },

        setup() {
            type User = {
                id: number;
                name: string;
                email: string;
            };

            const formData = reactive({
                users: [1, 4],
            });

            const database: User[] = [
                { id: 1, name: "John Smith", email: "john@example.com" },
                { id: 2, name: "Sarah Jones", email: "sarah@example.com" },
                { id: 3, name: "Michael Brown", email: "michael@example.com" },
                { id: 4, name: "Emma Wilson", email: "emma@example.com" },
                { id: 5, name: "Olivia Taylor", email: "olivia@example.com" },
                { id: 6, name: "James Anderson", email: "james@example.com" },
                { id: 7, name: "Sophia Thomas", email: "sophia@example.com" },
                { id: 8, name: "William Jackson", email: "william@example.com" },
                { id: 9, name: "Isabella White", email: "isabella@example.com" },
                { id: 10, name: "Benjamin Harris", email: "benjamin@example.com" },
            ];

            /**
             * Initial items contain only the selected records.
             *
             * This lets EvSelect cache the selected items before the async
             * server-side result list replaces the items array.
             */
            const items = ref<User[]>([
                database[0], // John Smith
                database[3], // Emma Wilson
            ]);

            const search = ref("");
            const menuOpen = shallowRef(false);
            const isLoading = shallowRef(false);
            const hasLoadedFirstPage = shallowRef(false);

            function fakeApiSearch(query = "") {
                return new Promise<User[]>((resolve) => {
                    window.setTimeout(() => {
                        const normalized = query.trim().toLowerCase();

                        let results = database;

                        if (normalized) {
                            results = database.filter((user) => {
                                return (
                                    user.name.toLowerCase().includes(normalized) ||
                                    user.email.toLowerCase().includes(normalized)
                                );
                            });
                        }

                        /**
                         * Simulate paged server-side results.
                         *
                         * Important: this deliberately excludes some selected
                         * items depending on search/page.
                         */
                        resolve(results.slice(0, 5));
                    }, 600);
                });
            }

            async function loadItems(query = "") {
                isLoading.value = true;

                try {
                    items.value = await fakeApiSearch(query);
                } finally {
                    isLoading.value = false;
                    hasLoadedFirstPage.value = true;
                }
            }

            async function onMenuOpen(value: boolean) {
                menuOpen.value = value;

                if (!value || hasLoadedFirstPage.value) {
                    return;
                }

                await loadItems("");
            }

            let searchTimer: number | undefined;

            function onSearch(value: string) {
                search.value = value;

                window.clearTimeout(searchTimer);

                searchTimer = window.setTimeout(() => {
                    loadItems(value);
                }, 250);
            }

            return {
                args,
                items,
                search,
                menuOpen,
                isLoading,
                onMenuOpen,
                onSearch,
                formData,
            };
        },

        template: `
            <ev-form :data="formData">
                <div style="max-width: 420px;">
                    <ev-select
                        v-bind="args"
                        name="users"
                        :items="items"
                        :search="search"
                        :menu-open="menuOpen"
                        item-title="name"
                        item-value="id"
                        behavior="autocomplete"
                        multiple
                        tags
                        :loading="isLoading"
                        :hide-items-empty="false"
                        items-empty-text="No matching users"
                        @update:menu-open="onMenuOpen"
                        @update:search="onSearch"
                    />
    
                    <pre style="margin-top: 16px;">formData: {{ formData }}</pre>
                    <pre>items: {{ items.map(item => item.name) }}</pre>
                </div>
            </ev-form>
        `,
    }),
};