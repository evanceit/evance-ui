import type { Meta, StoryObj } from "@storybook/vue3";

import { EvPage } from "../EvPage";

const meta: Meta<typeof EvPage> = {
    component: EvPage,
    title: "Components/Layout/EvPage",
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvPage>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvPage },
        setup() {
            return { args };
        },
        template: `<ev-page v-bind="args">
            This is where the page content goes
        </ev-page>`,
    }),
};
