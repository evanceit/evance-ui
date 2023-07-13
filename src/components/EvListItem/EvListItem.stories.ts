import type {Meta, StoryObj} from "@storybook/vue3";

import { EvListItem } from "../EvListItem";

const meta: Meta<typeof EvListItem> = {
    component: EvListItem,
    argTypes: {
        active: {
            control: 'boolean',
            description: "Controls the active state of the item."
        },
        disabled: {
            control: 'boolean',
            description: "Remove the ability to click or target the component."
        },
        href: {
            control: 'text',
            description: "Converts the list item into an `a` tag with a normal `href` attribute. " +
                "If you want to stay within your vue app, use the `to` attribute instead."
        },
        link: {
            control: 'boolean',
            description: "Manually designate the component as a link. Using `href` or `to` will do this automatically."
        },
        to: {
            control: 'text',
            description: 'Instead of using a regular `a` tags with an `href` attribute, ' +
                'use a `to` attribute provided by vue-router\'s `router-link` '
        }
    },
    args: {
        active: false,
        disabled: false,
        href: '',
        to: ''
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvListItem>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvListItem },
        setup() {
            return { args };
        },
        template: '<ev-list-item v-bind="args">{{ args.default }}</ev-list-item>'
    })
};