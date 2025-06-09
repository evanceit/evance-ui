import type { Meta, StoryObj } from "@storybook/vue3";

import { EvThumbnail } from "../EvThumbnail";

import EvImgStories from "@/components/EvImg/EvImg.stories";

const meta: Meta<typeof EvThumbnail> = {
    component: EvThumbnail,
    argTypes: {
        ...EvImgStories.argTypes,
        rounded: {
            control: "select",
            options: [
                0,
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "circle",
                "pill",
            ],
            description:
                "Designates the border-radius applied to the component.",
        },
    },
    args: {
        ...EvImgStories.args,
        rounded: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvThumbnail>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvThumbnail },
        setup() {
            return { args };
        },
        template: `<ev-thumbnail v-bind="args" />`,
    }),
};
