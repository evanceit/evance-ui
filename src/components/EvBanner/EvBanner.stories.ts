import type { Meta, StoryObj } from "@storybook/vue3";

import { EvBanner } from "../EvBanner";
import { EvButton, EvButtonProps } from "../EvButton";
import { EvLozenge } from "../EvLozenge";

const meta: Meta<typeof EvBanner> = {
    component: EvBanner,
    title: "Components/Feedback/EvBanner",
    argTypes: {
        actions: {
            description:
                "Supply an array of `EvButton` props to the actions prop. Or, use the actions slot.",
        },
        appearance: {
            control: "select",
            options: [
                "default",
                "primary",
                "notice",
                "danger",
                "success",
                "information",
                "warning",
            ],
        },
        variant: {
            control: "select",
            description:
                "The only two appearance variants supported by `EvBanner` is `bold` (default) and `tonal`.",
            options: ["bold", "tonal"],
        },
        dismissible: {
            control: "boolean",
            description:
                "Shows a cancel button to dismiss the banner, which sets the `modelValue` to `false`. " +
                "Clicking on the dismiss button will trigger a `click:dismiss` event.",
        },
        modelValue: {
            control: "boolean",
        },
        text: {
            control: "text",
            description:
                "`EvBanner` is designed to display text notifications at the top of the page. " +
                "It is recommended to use the `text` prop rather than the `default` slot.",
        },
        icon: {
            description: "May be supplied as a prop or as a slot.",
        },
        default: {
            description:
                "The default slot may be used as an alternative to the `text` prop. " +
                "Whilst this allows you to customize the banner content, it requires you to handle padding and truncation.",
        },
    },
    args: {
        dismissible: undefined,
        text: "Put your content here",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvBanner>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvBanner },
        setup() {

            const actions: EvButtonProps[] = [
                {
                    text: "Action 1",
                    onClick: () => alert("Action 1 clicked"),
                },
            ];

            return { args, actions };
        },
        template: '<ev-banner v-bind="args" :actions="actions" />',
    }),
};


export const IconSlot: Story = {
    render: () => ({
        components: { EvBanner, EvLozenge, EvButton },
        template: `<ev-banner appearance="primary" text="Editor 2.0 now available">
            <template #icon><ev-lozenge appearance="inverse" variant="tonal" class="ev-theme-light">New</ev-lozenge></template>
            <template #actions>
                <ev-button appearance="inverse" variant="tonal" text="Try" size="small" class="ev-theme-light" />
            </template>
    </ev-banner>`,
    }),
};