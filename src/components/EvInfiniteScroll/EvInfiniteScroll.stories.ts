import type { Meta, StoryObj } from "@storybook/vue3";

import { EvInfiniteScroll } from "../EvInfiniteScroll";

const meta: Meta<typeof EvInfiniteScroll> = {
    component: EvInfiniteScroll,
    argTypes: {
        tag: {
            description: "Specify a custom tag used on the root element.",
        },
    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvInfiniteScroll>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvInfiniteScroll },
        setup() {
            return { args };
        },
        template: `<ev-infinite-scroll v-bind="args"></ev-infinite-scroll>`,
    }),
};
