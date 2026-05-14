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
import { computed, getCurrentInstance, ref } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";

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
        tabsDisplay: {
            control: "select",
            options: ["auto", "tabs", "menu"],
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
        tabsDisplay: "auto",
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

            const breadcrumbs = [
                {
                    title: "Home",
                    href: "/",
                },
            ];

            const onClickBack = () => {
                console.log("Back button was clicked");
            };

            const onClickClose = () => {
                console.log("Close button was clicked");
            };

            return {
                args,
                tabs,
                actions,
                onClickBack,
                onClickClose,
                breadcrumbs,
            };
        },
        template: `
            <ev-toolbar
                v-bind="args"
                :tabs="tabs"
                :actions="actions" />
            
            <br />
            <p>Toolbar with breadcrumbs</p>
            <ev-toolbar
                v-bind="args"
                :breadcrumbs="breadcrumbs"
                :tabs="tabs"
                :actions="actions" />
            
            <br />
            <p>Toolbar with back & close button</p>
            <ev-toolbar
                v-bind="args"
                :tabs="tabs"
                :actions="actions" 
                @click:back="() => console.log('back')" 
                @click:close="() => console.log('close')" />
        `,
    }),
};



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/access/members",
            component: {
                template: `<div>Members area</div>`,
            },
        },
        {
            path: "/access/permissions",
            component: {
                template: `<div>Permissions area</div>`,
            },
        },
        {
            path: "/access/details",
            component: {
                template: `<div>Details area</div>`,
            },
        },
    ],
});

export const RoutedTabs: Story = {
    render: (args: any) => ({
        components: { EvToolbar, RouterView },
        setup() {
            const tabs = ref([
                {
                    text: "Members",
                    to: "/access/members",
                },
                {
                    text: "Permissions",
                    to: "/access/permissions",
                },
                {
                    text: "Details",
                    to: "/access/details",
                },
            ]);

            return { tabs };
        },
        template: `
        <div>
            <ev-toolbar :tabs="tabs" />

            <div style="margin-top: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                <strong>Current route output:</strong>
                <router-view />
            </div>
        </div>
        `,
    }),
    decorators: [
        (story) => ({
            components: { story },
            setup() {
                const instance = getCurrentInstance();

                if (instance) {
                    instance.appContext.app.use(router);
                    router.push("/");
                }

                return {};
            },
            template: `<story />`,
        }),
    ],
};