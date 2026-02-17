import type { Meta, StoryObj } from "@storybook/vue3";

import { EvMenu } from "../EvMenu";
import { EvButton } from "../EvButton";
import { EvList } from "../EvList";
import { EvSurface } from "../EvSurface";
import {ref} from "vue";

const meta: Meta<typeof EvMenu> = {
    component: EvMenu,
    title: "Components/Navigation/EvMenu",
    argTypes: {},
    args: {},
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvMenu>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvMenu, EvButton, EvList, EvSurface },
        setup() {
            const items = [
                {
                    title: "Example 1",
                    value: 1,
                },
                {
                    title: "Example 2",
                    value: 2,
                },
                {
                    title: "Example 3",
                    value: 3,
                },
            ];
            const ExampleMenuRef = ref(null);
            return { args, items, ExampleMenuRef };
        },
        template: `<ev-button ref="ExampleMenuRef">Menu</ev-button>
            <ev-menu v-bind="args" :activator="ExampleMenuRef?.$el">
                <ev-list :items="items"></ev-list>
            </ev-menu>`,
    }),
};
