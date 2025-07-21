import type { Meta, StoryObj } from "@storybook/vue3";

import { EvListItem } from "../EvListItem";
import { ChevronRightIcon, DotIcon } from "@/icons";
import { EvAvatar } from "../EvAvatar";
import {EvButton} from "../EvButton";

const meta: Meta<typeof EvListItem> = {
    components: {EvButton},
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
            options: ["none", "ChevronRightIcon", "DotIcon"],
            mapping: {
                none: null,
                ChevronRightIcon: ChevronRightIcon,
                DotIcon: DotIcon,
            },
        },
        iconEnd: {
            control: "select",
            options: ["none", "ChevronRightIcon", "DotIcon"],
            mapping: {
                none: null,
                ChevronRightIcon: ChevronRightIcon,
                DotIcon: DotIcon,
            },
        },
        link: {
            control: "boolean",
            description:
                "Manually designate the component as a link. Using `href` or `to` will do this automatically.",
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
        to: "",
        title: "Example list item",
        subtitle: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvListItem>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvListItem, EvAvatar, EvButton },
        setup() {
            return { args, DotIcon, ChevronRightIcon };
        },
        template: `
            <ev-list-item v-bind="args" />
            
            <ev-list-item 
                :icon-start="ChevronRightIcon" 
                href="#" 
                :icon-end="ChevronRightIcon" 
                title="Testing with prefix" subtitle="Hello this is a subtitle">
                <template #prefix>
                    <ev-avatar>G</ev-avatar>
                </template>
                <template #suffix>World</template>
            </ev-list-item>
            
            <ev-list-item title="Testing icon start slot" href="#">
                <template #prefix>
                    <ev-avatar>G</ev-avatar>
                </template>
                <template #iconStart>
                    <ev-button :icon="ChevronRightIcon" size="x-small" variant="subtle" />
                </template>
            </ev-list-item>
        `,
    }),
};
