import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButtonSelect } from "../EvButtonSelect";
import { EvButton } from "@/components";
import { shallowRef } from "vue";

const meta: Meta<typeof EvButtonSelect> = {
    component: EvButtonSelect,
    title: "Components/Actions/EvButtonSelect",
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

type Story = StoryObj<typeof EvButtonSelect>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButtonSelect, EvButton },
        setup() {
            const selected = shallowRef();
            return { args, selected };
        },
        template: `
    <ev-button-select v-bind="args" v-model="selected">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
        <ev-button>Button 4</ev-button>
    </ev-button-select>`,
    }),
};
