import type {Meta, StoryObj} from "@storybook/vue3";

import ExampleDrawer from "./ExampleDrawer.vue";
import {EvButton} from "@/components";
import {useDrawer} from "@/composables/drawer.ts";

const meta: Meta = {
    title: 'Overlays/EvDrawerService'
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvButton, ExampleDrawer },
        setup() {

            const drawer = useDrawer();

            function open() {
                drawer.open({
                    slots: {
                        default: ExampleDrawer
                    }
                });
            }

            return { args, open };
        },
        template: `<ev-button @click="open">Open drawer</ev-button>`
    }),
};