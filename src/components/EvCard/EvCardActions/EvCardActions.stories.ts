import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCardActions } from "../EvCardActions";
import { EvButtonProps } from "@/components";
import { ArrowContinueIcon } from "@/icons";
import EvButtonGroupStories from "../../EvButtonGroup/EvButtonGroup.stories";
import { omit } from "../../../util";

const meta: Meta<typeof EvCardActions> = {
    component: EvCardActions,
    title: "Components/Layout/EvCard/EvCardActions",
    argTypes: {
        justify: {
            control: "select",
            options: [
                "end",
                "start",
                "center",
                "space-between",
                "space-around",
                "space-evenly",
            ],
            description:
                "When `grow` is `false`, this prop allows the button " +
                "group to be positioned within the card actions container. " +
                "The default position of actions is `end`.",
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", "x-large"],
            description:
                "The size of the button group. This prop is inherited from `EvButtonGroup`.",
        },

        ...omit(EvButtonGroupStories.argTypes as any, ["size"]),
    },
    args: {
        justify: "end",
        size: "medium",
        ...omit(EvButtonGroupStories.args as any, ["size"]),
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCardActions>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCardActions },
        setup() {
            const items: EvButtonProps[] = [
                {
                    text: "Cancel",
                },
                {
                    appearance: "primary",
                    iconEnd: ArrowContinueIcon,
                    text: "Continue",
                },
            ];

            return { args, items };
        },
        template: `<ev-card-actions v-bind="args" :items="items" />`,
    }),
};
