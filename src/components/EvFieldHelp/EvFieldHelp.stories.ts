import type { Meta, StoryObj } from "@storybook/vue3";

import { EvFieldHelp } from "../EvFieldHelp";
import { DiscountIcon } from "@/icons";
import {
    EvBlock,
    EvButton,
    EvCardContent,
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
        field: {
            description: "The `field` slot can have any content.",
        },
        help: {
            description:
                "The `help` slot is intended to be used with the `<ev-card-content>` components and provides size defaults.",
        },
    },
    args: {
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvFieldHelp>;

/**
 * The `<ev-field-help>` component is intended to provide helpful information to form fields.
 * The help content appears to the side of the form. Whilst it may be used independently
 * it is intended to be used in conjunction with `<ev-field-helpers>`, which wraps a form.
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
            EvCardContent,
        },
        setup() {
            return { args, DiscountIcon };
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
                <ev-card-content :icon="DiscountIcon" title="Discounts on subtotals">
                    <ev-text>
                        When selecting a fixed discount on subtotal all products are eligible and the discount
                        amount will be split across the customer’s cart.
                    </ev-text>
                    <ev-link target="_blank">Learn about split discounts</ev-link>
                </ev-card-content>
            </template>
        </ev-field-help>
        `,
    }),
};
