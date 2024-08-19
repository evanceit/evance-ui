import type { Meta, StoryObj } from "@storybook/vue3";

import { EvFormHelp } from "../EvFormHelp";
import { DiscountIcon } from "@/icons";
import {EvLink, EvText, EvTextfield} from "@/components";

const meta: Meta<typeof EvFormHelp> = {
    component: EvFormHelp,
    title: "Forms/EvFormHelp",
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

type Story = StoryObj<typeof EvFormHelp>;

/**
 * The `<ev-form-help>` component is intended to provide helpful information to form fields.
 */
export const Primary: Story = {
    render: (args: any) => ({
        components: { EvFormHelp, EvText, EvLink, EvTextfield },
        setup() {

            return { args };
        },
        template: `<ev-form-help v-bind="args">
            <template #field>
                <ev-textfield label="My field" hint="Hello this is a description for the field" />
            </template>
            <template #help>
                <ev-text>
                    When selecting a fixed discount on subtotal all products are eligible and the discount
                    amount will be split across the customer’s cart.
                </ev-text>
                <ev-link target="_blank">Learn about split discounts</ev-link>
            </template>
        </ev-form-help>
        `,
    }),
};
