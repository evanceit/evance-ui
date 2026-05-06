import type { Meta, StoryObj } from "@storybook/vue3";
import { EvEditOnClick, EvDateField } from "@/components";
import { ref } from "vue";

const meta: Meta<typeof EvEditOnClick> = {
    component: EvEditOnClick,
    title: "Components/Forms/EvEditOnClick",
    argTypes: {
        disabled: {
            control: "boolean",
            description: "Disables the component and prevents editing. ",
        },
        editing: {
            control: "boolean",
            description: "Allows you to manually enter the component into an editing state. " +
                "Use `v-model:editing` for bidirectional updates, or listen to `@update:editing`."
        },
        field: {
            description:
                "The field slot allows you to customize the field used for editing. Slot props include:" +
                "<ul>" +
                "<li>`confirm`: Function to confirm the edited value and close the edit view.</li>" +
                "<li>`cancel`: Function to cancel the edit and revert to the original value.</li>" +
                "<li>`value`: The editing value of the field.</li>" +
                "<li>`error`: Whether the field is in an error state.</li>" +
                "</ul>",
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
                "Use the `placeholder` prop to display a value when the model value is empty. " +
                "Use the `placeholder` slot to customize the placeholder.",
        },
        default: {
            control: false,
            description:
                "The default slot content to display when the component is not in edit mode. " +
                "If not provided, the model value will be displayed.",
        },
        onConfirm: {
            control: false,
            description:
                "Use the `onConfirm` prop to supply a `EvEditOnClickConfirm` function to handle the confirmation of the edited value asynchronously" +
                ", such as saving changes to a database or validating user input.",
        },
    },
    args: {
        disabled: false,
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
                if (context.value.length >= 3) {
                    return true;
                }
                return {
                    valid: false,
                    errors: ["Should be a minimum of 3 characters"],
                };
            };

            const required = (value) => {
                if (!value.length) {
                    return "Required";
                }
                return true;
            };

            return { args, confirmHandler, required };
        },
        template: `
            <ev-edit-on-click 
                v-bind="args"
                :validators="[required]"
                @confirm="confirmHandler" />
        `,
    }),
};

export const ExampleWithPicker: Story = {
    render: (args) => ({
        components: { EvEditOnClick, EvDateField },
        setup() {
            const date = ref("2026-05-06");
            const dateField = ref(null);

            return { date, dateField };
        },
        template: `
            <ev-edit-on-click 
                v-model="date"
                :hide-actions="true"
                placeholder="Never" 
                :click-outside-include="() => [dateField?.overlayEl]">
                <template #field="{ value, error, confirm, cancel, updateValue }">
                    <ev-date-field
                        ref="dateField"
                        icon-start=""
                        :autoselect="true"
                        :error="error"
                        :model-value="value"
                        placeholder="Never"
                        @keyup.enter="confirm"
                        @keyup.esc="cancel"
                        @update:model-value="updateValue"
                        @select="confirm" />
                </template>
            </ev-edit-on-click>
        `,
    }),
};
