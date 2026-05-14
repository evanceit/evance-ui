import type { Meta, StoryObj } from "@storybook/vue3";

import { EvList } from "../EvList";
import {getCurrentInstance, ref} from "vue";
import { EvListItem } from "../EvListItem";
import {createMemoryHistory, createRouter, createWebHistory, RouterView} from "vue-router";

const meta: Meta<typeof EvList> = {
    component: EvList,
    title: "Components/Data/EvList",
    argTypes: {
        disabled: {
            control: "boolean",
        },
        required: {
            control: "boolean",
        },
        returnObject: {
            control: "boolean",
        },
        selectStrategy: {
            control: "select",
            options: [
                undefined,
                "single-any",
                "single-leaf",
                "multi-any",
                "multi-leaf",
                "cascade-leaf",
            ],
            description: "",
        },
    },
    args: {
        disabled: false,
        required: false,
        returnObject: false,
    },
};

export default meta;

type Story = StoryObj<typeof EvList>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvList },
        setup() {
            const items = [
                {
                    title: "Example 1",
                    value: 1,
                },
                {
                    type: "divider",
                },
                {
                    type: "subheader",
                    title: "Subheading",
                    children: [
                        {
                            title: "Example 4",
                            value: 4,
                        },
                    ],
                },
                {
                    title: "Example 2",
                    value: 2,
                    children: [
                        {
                            title: "Example 2.1",
                            value: 2.1,
                        },
                        {
                            title: "Example 2.2",
                            value: 2.2,
                            children: [
                                {
                                    title: "Example 2.2.1",
                                    value: "2.2.1",
                                },
                                {
                                    title: "Example 2.2.2",
                                    value: "2.2.2",
                                },
                            ],
                        },
                        {
                            title: "Example 2.3",
                            value: 2.3,
                        },
                    ],
                },
                {
                    title: "Example 3",
                    value: 3,
                },
            ];

            const selected = ref([]);

            return { args, items, selected };
        },
        template:
            '<ev-list v-bind="args" :items="items" v-model:selected="selected" /> {{ selected }}',
    }),
};


export const FlatLists: Story = {
    render: (args: any) => ({
        components: { EvList, EvListItem },
        setup() {
            return {};
        },
        template: `<ev-list>
                <ev-list-item title="Item 1" />
                <ev-list-item title="Item 2" />
                <ev-list-item title="Item 3" />
            </ev-list>`,
    }),
};

export const NestedLists: Story = {
    render: (args: any) => ({
        components: { EvList, EvListItem },
        setup() {
            const items = [
                {
                    title: "Item 1",
                    children: [
                        { title: "Item 1.1" },
                        {
                            title: "Item 1.2",
                            children: [{ title: "Item 1.2.1" }],
                        },
                        { title: "Item 1.3" },
                    ],
                },
                {
                    title: "Item 2",
                    children: [
                        { title: "Item 2.1" },
                        {
                            title: "Item 2.2",
                            children: [{ title: "Item 2.2.1" }],
                        },
                        { title: "Item 2.3" },
                    ],
                },
                {
                    title: "Item 3",
                    children: [
                        { title: "Item 3.1" },
                        {
                            title: "Item 3.2",
                            children: [{ title: "Item 3.2.1" }],
                        },
                        { title: "Item 3.3" },
                    ],
                },
            ];

            return { items };
        },
        template: `<ev-list :items="items" />`,
    }),
};

export const LazyLoading: Story = {
    render: (args: any) => ({
        components: { EvList },
        setup() {
            const items = ref([
                {
                    title: "Example 1",
                    value: 1,
                    children: [],
                },
                {
                    title: "Example 2",
                    value: 2,
                    children: [],
                },
                {
                    title: "Example 3",
                    value: 3,
                    children: [],
                },
            ]);
            return { items };
        },
        methods: {
            loadChildren(item: any) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            {}
                        ]);
                    });
                });
            },
        },
        template: `<ev-list :items="items" :load-children="loadChildren" />`,
    }),
};


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: {
                template: `<div>Home route</div>`,
            },
        },
        {
            path: "/test-link-1",
            component: {
                template: `<div>Test link 1 route</div>`,
            },
        },
        {
            path: "/test-link-2",
            component: {
                template: `<div>Test link 2 route</div>`,
            },
        },
    ],
});

export const RoutedListItems: Story = {
    render: (args: any) => ({
        components: { EvList, RouterView },
        setup() {
            const items = ref([
                {
                    title: "Home route",
                    to: "/",
                },
                {
                    title: "Test link 1 route",
                    to: "/test-link-1",
                },
                {
                    title: "Test link 2 route",
                    to: "/test-link-2",
                },
            ]);

            const selected = ref([]);
            return { items, selected };
        },
        template: `
        <div>
            <ev-list v-model:selected="selected" :item-props="true" :items="items" />

            <div style="margin-top: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                <strong>Current route output:</strong>
                <router-view />
            </div>
        </div>
        `,
    }),
    decorators: [
        (story) => ({
            components: { story },
            setup() {
                const instance = getCurrentInstance();

                if (instance) {
                    instance.appContext.app.use(router);
                    router.push("/");
                }

                return {};
            },
            template: `<story />`,
        }),
    ],
};
