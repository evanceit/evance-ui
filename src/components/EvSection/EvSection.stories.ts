import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSection } from "../EvSection";

const meta: Meta<typeof EvSection> = {
    component: EvSection,
    title: "Components/Layout/EvSection",
    argTypes: {
        title: {
            control: "text",
            description: "The title that appears above the section.",
        },
        default: {
            control: "text",
            description: "The `default` slot.",
        },
    },
    args: {
        title: "Example",
        default: "This is where your content should go.",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSection>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSection },
        setup() {
            return { args };
        },
        template: `<ev-section v-bind="args">{{ args.default }}</ev-section>`,
    }),
};
