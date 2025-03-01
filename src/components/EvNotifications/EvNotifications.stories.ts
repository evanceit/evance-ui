import type { Meta, StoryObj } from "@storybook/vue3";
import { EvNotifications } from "../EvNotifications";
import { EvNotificationProps } from "@/components/EvNotification";
import { EvButton } from "@/components";
import { ArrowContinueIcon, MinusIcon, PlusIcon } from "@/icons";
import { randomArrayItem } from "@/util";
import { useNotification } from "@/composables/notification";

const meta: Meta<typeof EvNotifications> = {
    component: EvNotifications,
    title: "Services/EvNotifications",
};

export default meta;

type Story = StoryObj<typeof EvNotifications>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvNotifications, EvButton },
        setup() {
            const notification = useNotification();

            const appearances = [
                "default",
                "danger",
                "success",
                "warning",
                "notice",
                "information",
            ];
            const variants = ["subtle", "tonal", "bold"];

            function addItem() {
                const props: EvNotificationProps = {
                    title: `Wow a new notification`,
                    appearance: randomArrayItem(appearances),
                    variant: randomArrayItem(variants),
                    timeout: 3000,
                    description:
                        "This will self-dismiss in <strong>3 seconds</strong>.",
                    actions: [
                        {
                            text: "Say Goodbye",
                            iconEnd: ArrowContinueIcon,
                            onClick() {
                                dismiss();
                            },
                        },
                    ],
                };
                const { dismiss } = notification.add(props);
            }

            return { args, PlusIcon, MinusIcon, addItem };
        },
        template: `
            
            <ev-notifications />
            
            <p>Create a random Notfication</p>
            <ev-button @click="addItem" :icon-start="PlusIcon">Add item</ev-button>
        `,
    }),
};

export const Saved: Story = {
    render: (args: any) => ({
        components: { EvNotifications, EvButton },
        setup() {
            const notification = useNotification();

            function save() {
                const props: EvNotificationProps = {
                    title: `Saved!`,
                    appearance: "success",
                    actions: [
                        {
                            text: "Thanks",
                            onClick: () => {
                                dismiss();
                            },
                        },
                    ],
                };
                const { dismiss } = notification.add(props);
            }

            return { args, save };
        },
        template: `
            <ev-notifications />
            <ev-button @click="save">Save</ev-button>
        `,
    }),
};
