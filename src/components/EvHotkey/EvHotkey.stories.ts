import type { Meta, StoryObj } from "@storybook/vue3";

import { EvHotkey } from "../EvHotkey";

const meta: Meta<typeof EvHotkey> = {
    component: EvHotkey,
    title: "Components/Navigation/EvHotkey",
    argTypes: {
        keys: {
            control: "select",
            options: [
                "Cmd+S",
                "Cmd+Shift+L",
                "Alt+L",
                "Tab",
                "Escape",
                "Ctrl+P",
                "Cmd+ArrowUp",
                "ArrowDown",
            ],
        },
        platform: {
            control: "select",
            options: ["auto", "pc", "mac"],
        },
        displayMode: {
            control: "select",
            options: ["icon", "text"],
        },
        variant: {
            control: "select",
            options: ["default", "tonal", "outlined", "bold", "text"],
        },
    },
    args: {
        keys: "Cmd+S",
        platform: "auto",
        displayMode: "icon",
    },
};

export default meta;

type Story = StoryObj<typeof EvHotkey>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvHotkey },
        setup() {
            return { args };
        },
        template: `A great shortcut is <ev-hotkey v-bind="args" /> and it's great!`,
    }),
};
