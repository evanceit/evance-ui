import type { Meta, StoryObj } from "@storybook/vue3";

import { EvList } from "../EvList";
import { ref } from "vue";
import { EvListItem } from "../EvListItem";

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
