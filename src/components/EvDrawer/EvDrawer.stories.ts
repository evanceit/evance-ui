import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDrawer } from "../EvDrawer";
import { EvButton } from "@/components";
import { omit } from "@/util";
import EvDialogStories from "@/components/EvDialog/EvDialog.stories";

const meta: Meta<typeof EvDrawer> = {
    component: EvDrawer,
    title: "Components/Overlays/EvDrawer",
    argTypes: {
        position: {
            control: "select",
            options: ["left", "right", "bottom", "top"],
        },

        ...omit(EvDialogStories.argTypes as any, ["position", "transition"]),
    },
    args: {
        position: "left",
        ...omit(EvDialogStories.args as any, ["position", "transition"]),
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDrawer>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDrawer, EvButton },
        setup() {
            return { args };
        },
        template: `
<ev-drawer v-bind="args">
    <template #activator="{ props }">
        <ev-button v-bind="props">Click me</ev-button>
    </template>
    <template #default>
        Hello World!
    </template>
</ev-drawer>
        `,
    }),
};
