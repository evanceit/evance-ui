import type { Meta, StoryObj } from "@storybook/vue3";
import { EvNotification } from "../EvNotification";
import { ReloadIcon } from "../../icons";
import { EvButton } from "@/components/EvButton";
import EvMessageStories from "../EvMessage/EvMessage.stories.ts";

const meta: Meta<typeof EvNotification> = {
    component: EvNotification,
    title: "Overlays/EvNotification",
    argTypes: {
        timeout: {
            control: "number",
            description:
                "Sets the amount of milliseconds before the notification auto-dismisses.",
        },

        ...EvMessageStories.argTypes,
    },
    args: {
        timeout: undefined,
        ...EvMessageStories.args,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvNotification>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvNotification, EvButton },
        setup() {
            return { args, ReloadIcon };
        },
        template: `
            <ev-notification v-bind="args">{{ args.default }}</ev-notification>
            
            <div v-if="!args.modelValue">
                <ev-button :icon="ReloadIcon" @click="args.modelValue = true">Reset</ev-button>
            </div>`,
    }),
};
