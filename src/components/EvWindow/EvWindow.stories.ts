import type {Meta, StoryObj} from "@storybook/vue3";

import {EvWindow, EvWindowItem} from "../EvWindow";
import {shallowRef} from "vue";
import {EvButton} from "@/components";
import {ArrowBack, ArrowContinue} from "@/icons";

const meta: Meta<typeof EvWindow> = {
    component: EvWindow,
    argTypes: {
        continuous: {
            control: 'boolean'
        },
        disabled: {
            control: 'boolean'
        },
        iconNext: {
            description: 'Allows you to change the icon to go forwards, alternatively you can use the `next` slot.'
        },
        iconPrevious: {
            description: 'Allows you to change the icon to go back, alternatively you can use the `previous` slot.'
        },
        modelValue: {
            description: 'The current window'
        },
        reverse: {
            description: 'Reverse the direction of animation between slides.'
        },
        selectedClass: {

        },
        showArrows: {
            control: 'select',
            options: [true, false, 'hover']
        },
        touch: {
            description: 'Custom touch functions'
        }
    },
    args: {
        continuous: false,
        disabled: false,
        showArrows: false
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

            return { args, step, goto, reverse, ArrowContinue, ArrowBack };
        },
        template: `
            <ev-window v-bind="args" v-model="step" :reverse="reverse">
                <ev-window-item :value="1">
                    <h3>Step 1</h3>
                    <p>A step with only one line</p>
                    <ev-button @click="goto(2)" :icon-end="ArrowContinue">Go to step 2</ev-button>
                </ev-window-item>
                <ev-window-item :value="2">
                    <h3>Step 2</h3>
                    <p>A step with this line</p>
                    <p>And, with this line</p>
                    <ev-button @click="goto(3)" :icon-end="ArrowContinue">Go to step 3</ev-button>
                </ev-window-item>
                <ev-window-item :value="3">
                    <h3>Step 3</h3>
                    <p>A step with only one line</p>
                    <ev-button @click="goto(1)" :icon-start="ArrowBack">Start over</ev-button>
                </ev-window-item>
            </ev-window>
        `
    })
};