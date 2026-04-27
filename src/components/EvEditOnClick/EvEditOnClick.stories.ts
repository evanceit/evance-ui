import type { Meta, StoryObj } from "@storybook/vue3";
import { EvEditOnClick } from "@/components/EvEditOnClick";

const meta: Meta<typeof EvEditOnClick> = {
    component: EvEditOnClick,
    title: "Components/Forms/EvEditOnClick",
    argTypes: {
        editing: {
            control: "boolean",
            description: "Allows you to manually enter the component into an editing state. " +
                "Use `v-model:editing` for bidirectional updates, or listen to `@update:editing`."
        },
        modelValue: {
            control: "text",
            description:
                "Bind with `v-model` represents the raw value to be edited.",
        },
        persistent: {
            control: "boolean",
            description:
                "When set to `true` the edit view does not close on field blur.",
        },
        loading: {
            control: "boolean",
            description:
                "When set to `true` the component shows a loading indicator instead of the editable content. " +
                "Use the `loading` slot to customize the loading state.",
        },
        hideActions: {
            control: "boolean",
            description:
                "When set to `true` the component hides the confirm and cancel action buttons in the edit view.",
        },
        placeholder: {
            control: "text",
            description:
                "The placeholder text to display when the model value is empty. " +
                "Use the `placeholder` slot to customize the placeholder.",
        },
    },
    args: {
        editing: false,
        loading: false,
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
            const sleep = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));

            const confirmHandler = async (context) => {
                await sleep(750);
                if (context.value.length > 0) {
                    return true;
                }
                return {
                    valid: false,
                    errors: ["Required", "Should be a minimum of 3 characters"],
                };
            };
            return { args, confirmHandler };
        },
        template: `
            <ev-edit-on-click v-bind="args" @confirm="confirmHandler" :autoselect="true">

            </ev-edit-on-click>
        `,
    }),
};
