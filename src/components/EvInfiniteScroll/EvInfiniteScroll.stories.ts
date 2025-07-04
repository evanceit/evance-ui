import type { Meta, StoryObj } from "@storybook/vue3";

import { EvInfiniteScroll } from "../EvInfiniteScroll";
import { ref } from "vue";
import { EvButton, EvListItem, EvVirtualScroll } from "@/components";
import { ComponentExposed } from "vue-component-type-helpers";

const meta: Meta<typeof EvInfiniteScroll> = {
    component: EvInfiniteScroll,
    title: "Components/Data/EvInfiniteScroll",
    argTypes: {
        disabled: {
            control: "boolean",
            description: "Disable infinite scroll.",
        },
        direction: {
            control: "select",
            options: ["vertical", "horizontal"],
            description: "Defaults to `vertical`.",
        },
        height: {
            control: "text",
        },
        mode: {
            control: "select",
            options: ["intersect", "manual"],
            description:
                "Specifies if content should load automatically when scrolling (`intersect`) or manually (`manual`). " +
                "Defaults to `intersect`.",
        },
        side: {
            control: "select",
            options: ["start", "end", "both"],
            description:
                "Specifies the side where new content should appear. Either the `start`, `end`, or `both` sides. " +
                "Defaults to `end`.",
        },
        tag: {
            description: "Specify a custom tag used on the root element.",
        },
        load: {
            control: false,
            description: `The \`load\` event is issues upon intersection and offers the following parameters to listeners:
                <ul>
                    <li>\`side\` - a string representing the side which issued the intersection event is either \`start\` or \`end\`.</li>
                    <li>\`done\` - a function to tell infinite scroll you have reached the end of your results.</li>
                    <li>\`error\` - a function to tell infinite scroll there was an error during loading.</li>
                    <li>\`next\` - a function to tell infinite scroll there is more to come and to continue issuing intersect events.</li>
                </ul>
                `,
        },
        showFinished: {
            control: "boolean",
            description:
                "Whether to show the `finished` message or slot when the data has come to an end. " +
                "Defaults to `true`.",
        },
        reset: {
            control: false,
            description:
                "Exposed `reset()` method allows you to reset the state of the infinite scroll.",
        },
        rootElement: {
            control: false,
            description:
                "Exposed `rootElement` provide access to the HTML root element of the infinite scroll.",
        },
    },
    args: {
        disabled: false,
        direction: "vertical",
        height: "300",
        mode: "intersect",
        side: "end",
        showFinished: true,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvInfiniteScroll>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvInfiniteScroll, EvListItem, EvVirtualScroll, EvButton },
        setup() {
            const items = ref(Array.from({ length: 25 }, (k, v) => v + 1));
            const limit = 100;

            async function api(): Promise<any[]> {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const additional =
                            items.value.length < limit
                                ? Array.from(
                                      { length: 25 },
                                      (k, v) => v + items.value.length + 1,
                                  )
                                : [];
                        resolve(additional);
                    }, 1000);
                });
            }
            async function load({ done, next }) {
                // Perform API call
                const res = await api();
                items.value.push(...res);
                res.length ? next() : done();
            }

            const infiniteScrollRef =
                ref<ComponentExposed<typeof EvInfiniteScroll>>();

            function onClickReset() {
                items.value = [];
                infiniteScrollRef.value?.reset();
            }

            return { args, items, load, infiniteScrollRef, onClickReset };
        },
        template: `
            <p>
                <ev-button @click="onClickReset">Reset</ev-button>
            </p>
            <ev-infinite-scroll ref="infiniteScrollRef" v-bind="args" @load="load">
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
