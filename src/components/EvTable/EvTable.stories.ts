import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTable } from "@/components/EvTable";

const meta: Meta<typeof EvTable> = {
    component: EvTable,
    title: "Components/Data/EvTable",
    argTypes: {},
    args: {},
};

export default meta;

type Story = StoryObj<typeof EvTable>;

export const Primary: Story = {
    render: (args: any) => ({
        components: {
            EvTable,
        },
        setup() {
            const desserts = [
                {
                    name: "Frozen Yogurt",
                    calories: 159,
                },
                {
                    name: "Ice cream sandwich",
                    calories: 237,
                },
                {
                    name: "Eclair",
                    calories: 262,
                },
                {
                    name: "Cupcake",
                    calories: 305,
                },
                {
                    name: "Gingerbread",
                    calories: 356,
                },
                {
                    name: "Jelly bean",
                    calories: 375,
                },
                {
                    name: "Lollipop",
                    calories: 392,
                },
                {
                    name: "Honeycomb",
                    calories: 408,
                },
                {
                    name: "Donut",
                    calories: 452,
                },
                {
                    name: "KitKat",
                    calories: 518,
                },
            ];

            return {
                args,
                desserts,
            };
        },
        template: `
                <ev-table hoverable
                    v-bind="args">
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Calories</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in desserts" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                    </tr>
                    </tbody>
                </ev-table>
        `,
    }),
};
