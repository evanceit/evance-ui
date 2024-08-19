import type { Meta, StoryObj } from "@storybook/vue3";

import { EvFieldHelp } from "../EvFieldHelp";
import { DiscountIcon } from "@/icons";
import {
    EvBlock,
    EvButton,
    EvLabel,
    EvLayout,
    EvLink,
    EvText,
    EvTextfield,
} from "@/components";

const meta: Meta<typeof EvFieldHelp> = {
    component: EvFieldHelp,
    title: "Forms/EvFieldHelp",
    argTypes: {
        appearance: {
            control: "select",
            options: [
                "default",
                "primary",
                "success",
                "danger",
                "information",
                "warning",
            ],
        },
        icon: {
            control: "select",
            options: [undefined, "DiscountIcon"],
            mapping: {
                DiscountIcon: DiscountIcon,
            },
        },
        title: {
            control: "text",
        },
    },
    args: {
        icon: "DiscountIcon",
        title: "Discounts on subtotals",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvFieldHelp>;

/**
 * The `<ev-form-help>` component is intended to provide helpful information to form fields.
 */
export const Primary: Story = {
    render: (args: any) => ({
        components: {
            EvFieldHelp,
            EvText,
            EvLink,
            EvTextfield,
            EvLabel,
            EvButton,
            EvLayout,
            EvBlock,
        },
        setup() {

            return { args };
        },
        template: `<ev-field-help v-bind="args">
            <template #field>
                <ev-label class="mb-100" for="my-field" title="Discount code" hint="Customers must enter this code at checkout" />
                <ev-layout gutter="200">
                    <ev-block>
                        <ev-textfield id="my-field" />
                    </ev-block>
                    <ev-block width="auto">
                        <ev-button>Generate code</ev-button>
                    </ev-block>
                </ev-layout>
            </template>
            <template #help>
                <ev-text>
                    When selecting a fixed discount on subtotal all products are eligible and the discount
                    amount will be split across the customer’s cart.
                </ev-text>
                <ev-link target="_blank">Learn about split discounts</ev-link>
            </template>
        </ev-field-help>
        `,
    }),
};
