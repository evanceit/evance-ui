import type { Meta, StoryObj } from "@storybook/vue3";
import { EvToolbar } from "@/components";
import {
    SalesOrderFillIcon,
    InboxFillIcon,
    SalesEnquiryFillIcon,
    SalesQuotationFillIcon,
    PlusIcon,
    SalesOrderIcon,
    SalesQuotationIcon,
    SalesEnquiryIcon,
} from "@/icons";
import { computed } from "vue";

/**
 * `EvToolbar` is designed for most use-cases in Evance screens, which follow a similar pattern.
 */
const meta: Meta<typeof EvToolbar> = {
    component: EvToolbar,
    title: "Components/Layout/EvToolbar",
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
                "An icon may be used to as a visual compliment to the title. " +
                "Typically, the Fill version of the icon is used (if available).",
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
            description:
                "Medium size should be used on smaller dialogs/windows whilst Large should be used on page layouts.",
        },
        title: {
            control: "text",
        },
        tab: {
            description:
                "Sets the current tab by its value or index (if value is not supplied). " +
                "Use `v-model:tab` to ensure the value updates in both directions.",
        },
        tabs: {
            description:
                "Tabs may be supplied as an array of `EvTab` props. " +
                "If you would like more control you can use the `start` slot.",
        },
        actions: {
            description:
                "Actions may be supplied as an array of `EvButton` props. " +
                "If you would like more control you can use the `end` slot.",
        },
        "click:back": {
            description:
                "<p>The back button will appear when adding an event listener to the `click:back` event.</p>" +
                "<p>In this example we have added an event listener for completion - check the console.</p>",
        },
        "click:close": {
            description:
                "<p>The close button will appear when adding an event listener to the `click:close` event.</p>" +
                "<p>In this example we have added an event listener for completion - check the console.</p>",
        },
        "update:tab": {
            description:
                "Fired when the current tab changes, supplying the value of the current tab to the listener.",
        },
    },
    args: {
        icon: "InboxFillIcon",
        title: "Sales Desk",
        size: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvToolbar>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvToolbar },
        setup() {
            const tabs = [
                {
                    text: "All",
                },
                {
                    icon: SalesOrderIcon,
                    selectedIcon: SalesOrderFillIcon,
                    text: "Orders",
                },
                {
                    icon: SalesQuotationIcon,
                    selectedIcon: SalesQuotationFillIcon,
                    text: "Quotes",
                },
                {
                    icon: SalesEnquiryIcon,
                    selectedIcon: SalesEnquiryFillIcon,
                    text: "Enquiries",
                },
            ];

            const actions = computed(() => {
                if (args.size === "small") {
                    return [
                        {
                            icon: PlusIcon,
                        },
                    ];
                }
                return [
                    {
                        text: "Create",
                        icon: PlusIcon,
                        appearance: "primary",
                        variant: "bold",
                    },
                ];
            });

            const onClickBack = () => {
                console.log("Back button was clicked");
            };

            const onClickClose = () => {
                console.log("Close button was clicked");
            };

            return { args, tabs, actions, onClickBack, onClickClose };
        },
        template: `<ev-toolbar
            v-bind="args"
            :tabs="tabs"
            :actions="actions" />`,
    }),
};
