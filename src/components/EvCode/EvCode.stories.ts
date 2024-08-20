import type { Meta, StoryObj } from "@storybook/vue3";
import { EvCode, EvHeading, EvText } from "@/components";

const meta: Meta<typeof EvCode> = {
    title: "Typography/EvCode",
    component: EvCode,
    argTypes: {
        text: {
            control: "text",
            description:
                "You can supply text as a prop or use the `default` slot.",
        },
    },
    args: {
        text: "my.variable",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCode>;

/**
 * Use `ev-code` when you wish to highlight a short code snippet from the surrounding default text,
 * such as when referencing variable names.
 */
export const Primary: Story = {
    render: (args) => ({
        components: { EvCode, EvHeading, EvText },
        setup() {
            return { args };
        },
        template: `
            <p>
                <ev-code v-bind="args" />
            </p>
            
            <ev-text>
                Example inside the
                <ev-code text="<ev-text>" />
                component
            </ev-text>
            
            <ev-heading>
                Example inside the 
                <ev-code text="<ev-heading>" /> 
                component 
            </ev-heading>
        `,
    }),
};
