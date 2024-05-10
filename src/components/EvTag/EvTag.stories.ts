import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTag } from "../EvTag";
import { EvButton, EvIcon } from "@/components";
import { Reload } from "../../icons";
import { Appearance, Variant } from "@/util";

const meta: Meta<typeof EvTag> = {
    component: EvTag,
    argTypes: {
        appearance: {
            control: "select",
            options: Object.keys(Appearance),
        },
        variant: {
            control: "select",
            options: Object.keys(Variant),
        },
        closable: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        filter: {
            control: "boolean",
        },
        modelValue: {
            control: "boolean",
        },
        rounded: {
            control: "boolean",
        },
        tag: {
            control: "text",
            description: "Sets the HTML tag used for the component.",
        },
        text: {
            control: "text",
            description: "Sets the text inside the component.",
        },
    },
    args: {
        appearance: Appearance.default,
        variant: Variant.default,
        closable: false,
        disabled: false,
        filter: false,
        modelValue: true,
        rounded: false,
        tag: undefined,
        text: "Example tag",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTag>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTag, EvButton, EvIcon },
        setup() {
            const reset = () => {
                args["onUpdate:modelValue"](true);
            };
            return { args, Reload, reset };
        },
        template: `
<ev-tag v-bind="args">       
</ev-tag>
            
            <ev-button v-if="!args.modelValue" text="Reset" :icon="Reload" @click="reset" />
        `,
    }),
};
