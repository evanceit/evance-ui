import type { Meta, StoryObj } from "@storybook/vue3";

import { EvFilterButton } from "../EvFilterButton";
import { EvCheckbox } from "@/components";
import {ref} from "vue";

const meta: Meta<typeof EvFilterButton> = {
    component: EvFilterButton,
    title: "Components/Actions/EvFilterButton",
    argTypes: {
        title: {
            control: "text",
            description: "The title representing the filter",
        },
    },
    args: {
        title: "Status",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvFilterButton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvFilterButton, EvCheckbox },
        setup() {
            const selected = ref([]);
            return { args, selected };
        },
        template: `
            <ev-filter-button v-bind="args" v-model="selected" />

            <ev-checkbox v-model="selected" label="New" value="New" />

            <ev-checkbox v-model="selected" label="Pending" value="Pending" />
        `,
    }),
};
