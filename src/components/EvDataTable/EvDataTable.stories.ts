import type { Meta, StoryObj } from "@storybook/vue3";

import {
    EvDataTableCell,
    EvDataTable,
    EvDataTableRow,
} from "@/components/EvDataTable";

const meta: Meta<typeof EvDataTable> = {
    component: EvDataTable,
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDataTableCell>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDataTableCell, EvDataTable, EvDataTableRow },
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

            const items = [...Array(10000).keys()].map((i) => {
                const boat = { ...boats[i % boats.length] };
                boat.name = `${boat.name} #${i}`;
                return boat;
            });

            return {
                items,
            };
        },
        setup() {
            return { args };
        },
        template: `
            <ev-data-table v-bind="args" :items="items">
                
            </ev-data-table>
        `,
    }),
};
