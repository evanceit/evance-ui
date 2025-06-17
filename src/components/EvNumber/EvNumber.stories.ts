import type { Meta, StoryObj } from "@storybook/vue3";

import { EvNumber } from "../EvNumber";
import { EvButton } from "../EvButton";
import { EvButtonGroup } from "../EvButtonGroup";
import { EvHeading } from "../EvHeading";

const meta: Meta<typeof EvNumber> = {
    component: EvNumber,
    title: "Typography/EvNumber",
    argTypes: {
        value: {
            control: "text",
            description: "The numeric value",
        },
        prefix: {
            control: "text",
        },
        suffix: {
            control: "text",
        },
        duration: {
            control: "number",
        },
    },
    args: {
        value: 1,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvNumber>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvNumber, EvButton, EvButtonGroup, EvHeading },
        setup() {
            return { args };
        },
        template: `
            
            <ev-heading size="x-large">
                Hello 
                <ev-number v-bind="args" :format="{ style: 'currency',  currency: 'GBP' }" />
                after 
            </ev-heading>
            
            
            <p>&nbsp;</p>
            <ev-button-group>
                <ev-button @click="args.value++">Increment</ev-button>
                <ev-button @click="args.value--">Decrement</ev-button>

                <ev-button @click="args.value = parseFloat(args.value) + 49">+49</ev-button>

                <ev-button @click="args.value = parseFloat(args.value) - 49">-49</ev-button>

                <ev-button @click="args.value = parseFloat(args.value) * 100">&times;100</ev-button>


                <ev-button @click="args.value = parseFloat(args.value) / 100">/100</ev-button>
            </ev-button-group>
                
        `,
    }),
};
