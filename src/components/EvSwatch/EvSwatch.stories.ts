import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSwatch } from "../EvSwatch";

const meta: Meta<typeof EvSwatch> = {
    component: EvSwatch,
    title: "Components/Content/EvSwatch",
    argTypes: {
        size: {
            control: "select",
            options: [
                "undefined",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        rounded: {
            control: "select",
            options: [
                "undefined",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "circle",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        value: {
            control: "select",
            options: [
                "undefined",
                "#FF0000",
                "#FF000066",
                "Linear Gradient 1",
                "Linear Gradient 2",
                "Radial Gradient 1",
                "Image Background 1",
                "Image Background 2",
            ],
            mapping: {
                undefined: undefined,
                "Linear Gradient 1": {
                    type: "linear-gradient",
                    stops: [
                        { color: "#e66465", position: 0 },
                        { color: "#9198e5", position: 100 },
                    ],
                },
                "Linear Gradient 2": [
                    {
                        type: "linear-gradient",
                        angle: 217,
                        stops: [
                            { color: "rgb(255 0 0 / 80%)", position: 0 },
                            { color: "rgb(255 0 0 / 0%)", position: 70.71 },
                        ],
                    },
                    {
                        type: "linear-gradient",
                        angle: 127,
                        stops: [
                            { color: "rgb(0 255 0 / 80%)", position: 0 },
                            { color: "rgb(0 255 0 / 0%)", position: 70.71 },
                        ],
                    },
                    {
                        type: "linear-gradient",
                        angle: 336,
                        stops: [
                            { color: "rgb(0 0 255 / 80%)", position: 0 },
                            { color: "rgb(0 0 255 / 0%)", position: 70.71 },
                        ],
                    },
                ],
                "Radial Gradient 1": {
                    type: "radial-gradient",
                    stops: [
                        { color: "#e66465", position: 0 },
                        { color: "#9198e5", position: 100 },
                    ],
                },
                "Image Background 1": {
                    type: "image",
                    url: "https://picsum.photos/id/11/1600/900",
                },
                "Image Background 2": [
                    {
                        type: "linear-gradient",
                        angle: 217,
                        stops: [
                            { color: "rgb(255 0 0 / 80%)", position: 0 },
                            { color: "rgb(255 0 0 / 0%)", position: 70.71 },
                        ],
                    },
                    {
                        type: "linear-gradient",
                        angle: 127,
                        stops: [
                            { color: "rgb(0 255 0 / 80%)", position: 0 },
                            { color: "rgb(0 255 0 / 0%)", position: 70.71 },
                        ],
                    },
                    {
                        type: "linear-gradient",
                        angle: 336,
                        stops: [
                            { color: "rgb(0 0 255 / 80%)", position: 0 },
                            { color: "rgb(0 0 255 / 0%)", position: 70.71 },
                        ],
                    },
                    {
                        type: "image",
                        url: "https://picsum.photos/id/11/1600/900",
                    },
                ],
            },
        },
    },
    args: {
        size: undefined,
        rounded: undefined,
        value: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSwatch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSwatch },
        setup() {
            return { args };
        },
        template: `<ev-swatch v-bind="args" />`,
    }),
};
