import type { Meta, StoryObj } from "@storybook/vue3";

import { EvList } from "../EvList";
import { ref } from "vue";

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
        selectStrategy: {
            control: "select",
            options: [undefined, "single-any", "multi-any"],
        },
    },
    args: {
        disabled: false,
        required: false,
    },
    tags: ["autodocs"],
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

            const selected = ref([1]);

            return { args, items, selected };
        },
        template:
            '<ev-list v-bind="args" :items="items" v-model:selected="selected" /> {{ selected }}',
    }),
};
