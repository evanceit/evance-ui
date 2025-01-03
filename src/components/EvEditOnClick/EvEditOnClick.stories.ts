import type { Meta, StoryObj } from "@storybook/vue3";
import { EvEditOnClick } from "@/components/EvEditOnClick";

const meta: Meta<typeof EvEditOnClick> = {
    component: EvEditOnClick,
    argTypes: {
        editing: {
            control: "boolean",
            description: "Allows you to manually enter the component into an editing state. " +
                "Use `v-model:editing` for bidirectional updates, or listen to `@update:editing`."
        },
        modelValue: {
            control: "text",
            description: "Bind with `v-model` represents the raw value to be edited."
        },
        persistent: {
            control: "boolean",
            description: "When set to `true` the edit view does not close on field blur.",
        }
    },
    args: {
        editing: false,
        modelValue: "test value",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvEditOnClick>;


export const Primary: Story = {
    render: (args) => ({
        components: { EvEditOnClick },
        setup() {
            return { args };
        },
        template: `
            <ev-edit-on-click v-bind="args">

            </ev-edit-on-click>
        `,
    }),
};
