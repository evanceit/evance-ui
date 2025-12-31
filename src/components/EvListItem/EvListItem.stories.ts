import type { Meta, StoryObj } from "@storybook/vue3";

import { EvList } from "../EvList";
import { EvListItem } from "../EvListItem";
import { ChevronRightIcon, DotIcon } from "@/icons";
import { EvAvatar } from "../EvAvatar";
import { EvButton } from "../EvButton";
import {
    EllipsisIcon,
    HomeIcon,
    PlusIcon,
    ArrowContinueIcon,
} from "../../icons";
import { EvLozenge } from "../EvLozenge";

const meta: Meta<typeof EvListItem> = {
    component: EvListItem,
    title: "Components/Data/EvListItem",
    argTypes: {
        active: {
            control: "boolean",
            description: "Controls the active state of the item.",
        },
        exact: {
            control: "boolean",
            description: "Works with router links.",
        },
        disabled: {
            control: "boolean",
            description: "Remove the ability to click or target the component.",
        },
        href: {
            control: "text",
            description:
                "Converts the list item into an `a` tag with a normal `href` attribute. " +
                "If you want to stay within your vue app, use the `to` attribute instead.",
        },
        iconStart: {
            control: "select",
            options: ["none", "ChevronRightIcon", "DotIcon", "HomeIcon"],
            mapping: {
                none: null,
                ChevronRightIcon: ChevronRightIcon,
                DotIcon: DotIcon,
                HomeIcon: HomeIcon,
            },
        },
        iconEnd: {
            control: "select",
            options: [
                "none",
                "ChevronRightIcon",
                "DotIcon",
                "ArrowContinueIcon",
            ],
            mapping: {
                none: null,
                ChevronRightIcon: ChevronRightIcon,
                DotIcon: DotIcon,
                ArrowContinueIcon: ArrowContinueIcon,
            },
        },
        link: {
            control: "boolean",
            description:
                "Manually designate the component as a link. Using `href` or `to` will do this automatically.",
        },
        loading: {
            control: "boolean",
        },
        to: {
            control: "text",
            description:
                "Instead of using a regular `a` tags with an `href` attribute, " +
                "use a `to` attribute provided by vue-router's `router-link` ",
        },
        title: {
            control: "text",
        },
        subtitle: {
            control: "text",
        },
    },
    args: {
        active: false,
        exact: undefined,
        disabled: false,
        href: undefined,
        iconStart: undefined,
        iconEnd: undefined,
        loading: false,
        to: "",
        title: "Example list item",
        subtitle: undefined,
    },
};

export default meta;

type Story = StoryObj<typeof EvListItem>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvListItem, EvAvatar, EvButton, EvLozenge, EvList },
        setup() {
            return {
                args,
                DotIcon,
                ChevronRightIcon,
                EllipsisIcon,
                PlusIcon,
                HomeIcon,
            };
        },
        template: `
            <ev-list>
                <ev-list-item v-bind="args" />
    
                <ev-list-item
                    title="List item example (actionsOnHover)"
                    :actions-on-hover="[{ icon: PlusIcon }]" />
                
                <ev-list-item
                    title="List item example (actions)" 
                    :actions="[{ icon: EllipsisIcon }]" />
                
                <ev-list-item 
                    title="List item example (actions + actionsOnHover)" 
                    :actions-on-hover="[{ icon: PlusIcon }]"
                    :actions="[{ icon: EllipsisIcon }]" />
    
                <ev-list-item
                    href="#"
                    title="List item example (suffix + actions + actionsOnHover)"
                    :actions-on-hover="[{ icon: PlusIcon }]"
                    :actions="[{ icon: EllipsisIcon }]">
                    <template #suffix>
                        <ev-lozenge>Suffix</ev-lozenge>
                    </template>
                </ev-list-item>
                
                <ev-list-item
                    href="#"
                    title="List item example (icon)"
                    :icon-start="HomeIcon" />
    
                <ev-list-item
                    href="#"
                    title="List item example (icon + suffix)" 
                    :icon-start="HomeIcon">
                    <template #suffix>
                        <ev-lozenge>Suffix</ev-lozenge>
                    </template>
                </ev-list-item>
    
                <ev-list-item
                    href="#"
                    title="List item example (icon + suffix)">
                    <template #iconStart>
                        <ev-button :icon="HomeIcon" size="x-small" variant="subtle" />
                    </template>
                    <template #suffix>
                        <ev-lozenge>Suffix</ev-lozenge>
                    </template>
                </ev-list-item>
    
                <ev-list-item
                    href="#"
                    title="List item example (prefix)">
                    <template #prefix>
                        <ev-avatar size="x-small" text="G" />
                    </template>
                </ev-list-item>
    
                <ev-list-item
                    href="#"
                    title="List item example (prefix + subtitle)" subtitle="This is a subtitle">
                    <template #prefix>
                        <ev-avatar size="small" text="G" />
                    </template>
                </ev-list-item>
                
                <ev-list-item title="List item example (children)">
                    <template #children>
                        <ev-list-item title="Child item 1" subtitle="This is a subtitle" />
                        <ev-list-item title="Child item 2" subtitle="This is a subtitle" />
                        <ev-list-item title="Child item 3" subtitle="This is a subtitle" />
                    </template>
                </ev-list-item>
            </ev-list>
        `,
    }),
};
