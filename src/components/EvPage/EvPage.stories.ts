import type { Meta, StoryObj } from "@storybook/vue3";

import { EvPage } from "../EvPage";

const meta: Meta<typeof EvPage> = {
    component: EvPage,
    title: "Components/Layout/EvPage",
    argTypes: {
        inlineSize: {
            description: "The size of the page container",
            control: "select",
            options: [undefined, "small", "medium", "large"],
        },
        elevation: {
            description:
                "The `<ev-page>` component uses `<ev-surface>` as its base and is scrollable by default, " +
                "with a default elevation of `sunken`. This allows panels to stand out more on a page's backdrop.",
            control: "select",
            options: [undefined, "default", "sunken"],
        },
    },
    args: {
        elevation: undefined,
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
