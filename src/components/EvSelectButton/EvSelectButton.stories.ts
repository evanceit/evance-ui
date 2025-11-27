import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSelectButton } from "../EvSelectButton";
import { EvButton } from "@/components";
import { shallowRef } from "vue";

const meta: Meta<typeof EvSelectButton> = {
    component: EvSelectButton,
    title: "Components/Actions/EvSelectButton",
    argTypes: {
        appearance: {
            control: "select",
            options: [
                "default",
                "danger",
                "information",
                "notice",
                "primary",
                "success",
                "warning",
            ],
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
        },
        selectedAppearance: {
            control: "select",
            options: [
                "default",
                "danger",
                "information",
                "notice",
                "primary",
                "success",
                "warning",
            ],
        },
        selectedVariant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
        },
        disabled: {
            control: "boolean",
        },
        mandatory: {
            control: "boolean",
        },
        multiple: {
            control: "boolean",
        },
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
        },
        grow: {
            control: "boolean",
        },
        selectedClass: {
            description: "The",
        },
    },
    args: {
        appearance: undefined,
        variant: undefined,
        selectedAppearance: undefined,
        selectedVariant: undefined,
        disabled: false,
        mandatory: false,
        multiple: false,
        size: "medium",
        grow: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSelectButton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSelectButton, EvButton },
        setup() {
            const selected = shallowRef();
            return { args, selected };
        },
        template: `
    <ev-select-button v-bind="args" v-model="selected">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
        <ev-button>Button 4</ev-button>
    </ev-select-button>`,
    }),
};
