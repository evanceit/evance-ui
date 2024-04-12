import type {Meta, StoryObj} from "@storybook/vue3";

import {EvSlideGroup, EvSlideGroupItem} from "../EvSlideGroup";
import {EvButton} from "@/components";

const meta: Meta<typeof EvSlideGroup> = {
    component: EvSlideGroup,
    argTypes: {
        arrowsAlign: {
            control: 'select',
            options: ['start', 'end', 'around'],
            description: "Allows you to position the arrows at the start, end or around the slide group content. " +
                "Defaults to `around`."
        },
        arrowsHidden: {
            control: 'select',
            options: ['true', 'false', 'md-down'],
            mapping: {
                'true': true,
                'false': false,
                'md-down': 'md-down'
            },
            description: 'Arrows will appear when needed unless you decide to hide them. ' +
                'You can supply a boolean or a responsive rule such as `md-down` to hide arrows at particular breakpoint. '  +
                'Accepts `breakpoint`-`direction` responsive rules where the breakpoint is represented by `xs`, `sm`, `md`, ' +
                '`lg`, `xl`, `xxl` and the direction may be `down`, `up` or `only`.'
        },
        centerActive: {
            control: 'boolean'
        },
        direction: {
            control: 'select',
            options: ['horizontal', 'vertical']
        },
        disabled: {
            control: 'boolean'
        },
        iconNext: {
            description: 'Allows you to customize the next icon. Alternatively you can use the `next` slot.'
        },
        iconPrevious: {
            description: 'Allows you to customise the previous icon. Alternatively you can use the `previous` slot.'
        },
        multiple: {
            control: 'boolean'
        },
        symbol: {
            description: 'The Symbol used to hook into group functionality for components like `<ev-button-toggle>`.'
        },
        tag: {
            description: 'Specify a custom tag used on the root element.'
        }
    },
    args: {
        arrowsAlign: 'around',
        arrowsHidden: 'false',
        centerActive: false,
        direction: 'horizontal',
        disabled: false,
        multiple: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSlideGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSlideGroup, EvSlideGroupItem, EvButton },
        setup() {
            return { args };
        },
        template: `
        <ev-slide-group v-bind="args" style="max-height: 300px;">
            <ev-slide-group-item
                v-for="n in 25"
                :key="n"
                v-slot="{ isSelected, toggle }"
            >
                <ev-button
                    :appearance="isSelected ? 'primary' : 'default'"
                    :variant="isSelected ? 'tonal' : 'subtle'"
                    @click="toggle"
                >My button {{ n }}</ev-button>
            </ev-slide-group-item>
</ev-slide-group>
        `
    })
};