import type {Meta, StoryObj} from "@storybook/vue3";

import {EvWindow, EvWindowItem} from "../EvWindow";
import {shallowRef} from "vue";
import {EvButton} from "@/components";

const meta: Meta<typeof EvWindow> = {
    component: EvWindow,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvWindow>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvWindow, EvWindowItem, EvButton },
        setup() {
            const step = shallowRef(1);
            const reverse = shallowRef(false);

            const goto = (n: number) => {
                reverse.value = n < step.value;
                step.value = n;
            };

            return { args, step, goto, reverse };
        },
        template: `
            <ev-window v-bind="args" v-model="step" :reverse="reverse">
                <ev-window-item :value="1">
                    <h3>Step 1</h3>
                    <p>A step with only one line</p>
                    <ev-button @click="goto(2)">Go to step 2</ev-button>
                </ev-window-item>
                <ev-window-item :value="2">
                    <h3>Step 2</h3>
                    <p>A step with this line</p>
                    <p>And, with this line</p>
                    <ev-button @click="goto(3)">Go to step 3</ev-button>
                </ev-window-item>
                <ev-window-item :value="3">
                    <h3>Step 3</h3>
                    <p>A step with only one line</p>
                    <ev-button @click="goto(1)">Start over</ev-button>
                </ev-window-item>
            </ev-window>
        `
    })
};