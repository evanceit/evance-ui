import type {Meta, StoryObj} from "@storybook/vue3";

import {EvSlideGroup, EvSlideGroupItem} from "../EvSlideGroup";
import {EvButton} from "@/components";

const meta: Meta<typeof EvSlideGroup> = {
    component: EvSlideGroup,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSlideGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSlideGroup, EvSlideGroupItem, EvButton },
        setup() {
            return { args };
        },
        template: `
        <ev-slide-group v-bind="args" arrows-hidden>
            <ev-slide-group-item
                v-for="n in 25"
                :key="n"
                v-slot="{ isSelected, toggle }"
            >
                <ev-button
                    :appearance="isSelected ? 'primary' : 'default'"
                    :variant="isSelected ? 'tonal' : 'subtle'"
                    @click="toggle"
                >My button {{ n }}</ev-button>
            </ev-slide-group-item>
</ev-slide-group>
        `
    })
};