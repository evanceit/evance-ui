import type { Meta, StoryObj } from "@storybook/vue3";
import { EvEmptyState } from "@/components/EvEmptyState";
import { EvanceIcon, PlusIcon, SearchIcon } from "@/icons";
import { EvButtonProps } from "@/components/EvButton";
import { EvLayout } from "@/components/EvGrid";

const meta: Meta<typeof EvEmptyState> = {
    component: EvEmptyState,
    title: "Components/Feedback/EvEmptyState",
    argTypes: {
        actions: {
            control: false,
            description:
                "May be supplied as a prop, or as a slot for full control. " +
                "The actions prop accepts an array of `EvButton` props. Empty states typically have a single primary action, " +
                "hence the default `appearance` for actions is set to `primary`.",
        },
        icon: {
            control: "select",
            options: [undefined, "EvanceIcon", "SearchIcon"],
            mapping: {
                EvanceIcon: EvanceIcon,
                SearchIcon: SearchIcon,
            },
        },
        iconProps: {
            control: false,
            description: "Accepts `EvIcon` props",
        },
        image: {
            control: "select",
            options: [undefined, "https://picsum.photos/id/11/1600/900"],
        },
        imageProps: {
            control: false,
            description: "Accepts `EvImg` props.",
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
        title: {
            control: "text",
            description: "Used as the `text` prop for the heading.",
        },
        titleProps: {
            control: false,
            description: "Accepts `EvHeading` props.",
        },
        subtitle: {
            control: "text",
            description: "Unbelievably, the subtitle comes below the title.",
        },
        subtitleProps: {
            control: false,
            description: "Accepts `EvText` props.",
        },
    },
    args: {
        title: "No results",
        titleProps: undefined,
        subtitle: "It looks like there are no results at the moment.",
        subtitleProps: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvEmptyState>;


export const Primary: Story = {
    render: (args) => ({
        components: { EvEmptyState, EvLayout },
        setup() {
            const actions: EvButtonProps[] = [
                {
                    text: "Create",
                    icon: PlusIcon,
                    onClick: () => {
                        console.log("Create");
                    },
                },
            ];
            return { args, actions };
        },
        template: `
            <ev-layout column height="800px">
                <ev-empty-state v-bind="args" :actions="actions">

                </ev-empty-state>
            </ev-layout>

        `,
    }),
};
