import type { Meta, StoryObj } from "@storybook/vue3";

import { EvFormHelp } from "../EvFormHelp";
import {
    EvBlock,
    EvButton,
    EvCardContent,
    EvFieldHelp,
    EvLabel,
    EvLayout,
    EvLink,
    EvSurface,
    EvText,
    EvTextfield,
} from "@/components";

const meta: Meta<typeof EvFormHelp> = {
    component: EvFormHelp,
    title: "Components/Forms/EvFormHelp",
    argTypes: {
        breakpoint: {
            control: "select",
            options: ["sm", "md", "lg", "xl", "xxl"],
            description:
                "When to show the help to the aside. The default breakpoint is `md`.",
        },
    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvFormHelp>;

export const Primary: Story = {
    render: (args) => ({
        components: {
            EvFormHelp,
            EvSurface,
            EvFieldHelp,
            EvText,
            EvLink,
            EvTextfield,
            EvLabel,
            EvButton,
            EvLayout,
            EvBlock,
            EvCardContent,
        },
        setup() {
            return { args };
        },
        template: `<ev-form-help v-bind="args">
            <ev-surface elevation="panel" rounded="small" class="pa-400">

                <ev-field-help>
                    <template #field>
                        <ev-label class="mb-100" for="my-field" title="Discount code" hint="Customers must enter this code at checkout" />
                        <ev-layout gutter="200">
                            <ev-block>
                                <ev-textfield id="my-field" />
                            </ev-block>
                            <ev-block size="auto">
                                <ev-button>Generate code</ev-button>
                            </ev-block>
                        </ev-layout>
                    </template>
                    <template #help>
                        <ev-card-content title="Discounts on subtotals">
                            <ev-text>
                                When selecting a fixed discount on subtotal all products are eligible and the discount
                                amount will be split across the customer’s cart.
                            </ev-text>
                            <ev-link target="_blank">Learn about split discounts</ev-link>
                        </ev-card-content>
                    </template>
                </ev-field-help>

            </ev-surface>
        </ev-form-help>`,
    }),
};
