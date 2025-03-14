import type { Meta, StoryObj } from "@storybook/vue3";
import { EvApp } from "../EvApp";

const meta: Meta<typeof EvApp> = {
    component: EvApp,
    argTypes: {
        theme: {
            control: "select",
            options: ["system", "light", "dark"],
        },
    },
    args: {
        theme: "system",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvApp>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvApp },
        setup() {
            return { args };
        },
        template: `<ev-app v-bind="args">
            <div>
                <h1>This is an example</h1>
                <p>Your application goes here</p>
            </div>
        </ev-app>`,
    }),
};
