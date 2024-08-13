import type { Meta, StoryObj } from "@storybook/vue3";
import { EvToolbar } from "@/components";
import {
    SalesOrderFillIcon,
    InboxFillIcon,
    SalesEnquiryFillIcon,
    SalesQuotationFillIcon,
} from "@/icons";

const meta: Meta<typeof EvToolbar> = {
    component: EvToolbar,
    argTypes: {
        icon: {
            control: "select",
            options: [
                "none",
                "InboxFillIcon",
                "SalesOrderFillIcon",
                "SalesEnquiryFillIcon",
                "SalesQuotationFillIcon",
            ],
            mapping: {
                none: null,
                InboxFillIcon: InboxFillIcon,
                SalesOrderFillIcon: SalesOrderFillIcon,
                SalesEnquiryFillIcon: SalesEnquiryFillIcon,
                SalesQuotationFillIcon: SalesQuotationFillIcon,
            },
            description:
                "An icon may be used to as a visual compliment to the title.",
        },
        title: {
            control: "text",
        },
    },
    args: {
        icon: "none",
        title: "This is a very long title that will overflow",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvToolbar>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvToolbar },
        setup() {
            return { args };
        },
        template: `<ev-toolbar v-bind="args" />`,
    }),
};
