import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButton } from "@/components";
import { useDrawer } from "@/composables/drawer";
import { defineAsyncComponent } from "vue";

const meta: Meta = {
    title: "Services/EvDrawerService",
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
    render: (args) => ({
        components: { EvButton },
        setup() {
            const drawer = useDrawer();
            const drawerComponent = defineAsyncComponent(
                () => import("./ExampleDrawer.vue"),
            );

            function open() {
                drawer.open({
                    slots: {
                        default: drawerComponent,
                    },
                });
            }

            return { args, open };
        },
        template: `<ev-button @click="open">Open drawer</ev-button>`,
    }),
};
