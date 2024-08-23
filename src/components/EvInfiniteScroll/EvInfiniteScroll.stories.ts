import type { Meta, StoryObj } from "@storybook/vue3";

import { EvInfiniteScroll } from "../EvInfiniteScroll";
import { ref } from "vue";

const meta: Meta<typeof EvInfiniteScroll> = {
    component: EvInfiniteScroll,
    argTypes: {
        mode: {
            control: "select",
            options: ["intersect", "manual"],
        },
        height: {
            control: "text",
        },
        tag: {
            description: "Specify a custom tag used on the root element.",
        },
    },
    args: {
        mode: "intersect",
        height: 300,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvInfiniteScroll>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvInfiniteScroll },
        setup() {

            const items = ref(Array.from({ length: 30 }, (k, v) => v + 1));

            async function api() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(
                            Array.from(
                                { length: 10 },
                                (k, v) => v + items.value.at(-1) + 1,
                            ),
                        );
                    }, 1000);
                });
            }
            async function load({ done }) {
                // Perform API call
                const res = await api();
                items.value.push(...res);
                done("ok");
            }

            return { args, items, load };
        },
        template: `<ev-infinite-scroll v-bind="args" @load="load">
            <template v-for="(item, index) in items" :key="item">
                <div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
                    Item number #{{ item }}
                </div>
            </template>
        </ev-infinite-scroll>`,
    }),
};
