import type { Meta, StoryObj } from "@storybook/vue3";

import { EvInfiniteScroll } from "../EvInfiniteScroll";
import { ref } from "vue";
import { EvListItem, EvVirtualScroll } from "@/components";

const meta: Meta<typeof EvInfiniteScroll> = {
    component: EvInfiniteScroll,
    argTypes: {
        disabled: {
            control: "boolean",
            description: "Disable infinite scroll.",
        },
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
        disabled: false,
        mode: "intersect",
        height: "300",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvInfiniteScroll>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvInfiniteScroll, EvListItem, EvVirtualScroll },
        setup() {

            const items = ref(Array.from({ length: 50 }, (k, v) => v + 1));
            const limit = 500;

            async function api() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const additional =
                            items.value.length < limit
                                ? Array.from(
                                      { length: 25 },
                                      (k, v) => v + items.value.at(-1) + 1,
                                  )
                                : [];
                        resolve(additional);
                    }, 1000);
                });
            }
            async function load({ state }) {
                // Perform API call
                const res = await api();
                items.value.push(...res);
                if (!res.length) {
                    state("finished");
                } else {
                    state("ok");
                }
            }

            return { args, items, load };
        },
        template: `<ev-infinite-scroll v-bind="args" @load="load">
            <ev-virtual-scroll renderless :items="items">
                <template #default="{ item, index, itemRef }">
                    <ev-list-item :ref="itemRef" :link="true">
                        Item number #{{ item }}
                    </ev-list-item>
                </template>
            </ev-virtual-scroll>
        </ev-infinite-scroll>`,
    }),
};
