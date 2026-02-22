import type { Meta, StoryObj } from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import { EvLayout } from "../EvLayout";
import { EvSurface } from "../../EvSurface";
import { EvContainer } from "../EvContainer";

const meta: Meta<typeof EvContainer> = {
    component: EvContainer,
    title: "Components/Layout/EvContainer",
    argTypes: {
        centered: {
            control: "boolean",
            description:
                "Center the container horizontally. Defaults to `true`.",
        },
        tag: {
            description: "",
        },
        height: {
            control: "select",
            options: [undefined, "auto", "300"],
            description:
                "Set an explicit height to the block. Behaves similar to `width`.",
        },
        width: {
            control: "select",
            options: [undefined, "25%", "50%", "100%"],
        },
        hidden: {
            control: "select",
            options: [
                undefined,
                true,
                false,
                "xs-only",
                "xs-only lg-up",
                "['xs-only', 'lg-up']",
                "{ xs: 'only', lg: 'up' }",
            ],
            mapping: {
                "xs-only": "xs-only",
                "xs-only lg-up": "xs-only lg-up",
                "['xs-only', 'lg-up']": ["xs-only", "lg-up"],
                "{ xs: 'only', lg: 'up' }": { xs: "only", lg: "up" },
            },
            description:
                "Accepts a boolean, string or a display rule list as an array or object. ",
        },
        size: {
            control: "select",
            options: [undefined, "small", "medium", "large", "readable"],
            description:
                "Containers are used to constrain the width of centered page content. " +
                "Use the `size` prop in favour of `width` to set pre-defined maximum widths: " +
                "<ul>" +
                "<li>`medium` – typically used for form-based content with no aside or from helpers.</li>" +
                "<li>`large` – used for page content inside panels or forms with helper aside.</li>" +
                "<li>`readable` – a special size used to constrain blocks of text to a readable width.</li>" +
                "</ul>",
        },
    },
    args: {
        centered: true,
        size: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvBlock, EvLayout, EvSurface, EvContainer },
        setup() {
            return { args };
        },
        template: `
            <ev-container v-bind="args">
                <ev-layout column>
                    <ev-block size="auto">
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%;">
                            Block #1 (auto)
                        </ev-surface>
                    </ev-block>
                    <ev-block>
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                            Block #2 (grow)
                        </ev-surface>
                    </ev-block>
                    <ev-block size="auto">
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                            Block #3 (auto)
                        </ev-surface>
                    </ev-block>
                </ev-layout>
            </ev-container>
        `,
    }),
};
