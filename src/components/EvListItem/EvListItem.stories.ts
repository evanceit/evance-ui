import type {Meta, StoryObj} from "@storybook/vue3";

import { EvListItem } from "../EvListItem";
import {ChevronRight, Dot} from "../../icons";

const meta: Meta<typeof EvListItem> = {
    component: EvListItem,
    argTypes: {
        active: {
            control: 'boolean',
            description: "Controls the active state of the item."
        },
        activeExact: {
            control: 'boolean',
            description: "Works with router links."
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
        'icon-start': {
            control: 'select',
            options: ['none', 'ChevronRight', 'Dot'],
            mapping: {
                'none': null,
                'ChevronRight': ChevronRight,
                'Dot': Dot
            }
        },
        'icon-end': {
            control: 'select',
            options: ['none', 'ChevronRight', 'Dot'],
            mapping: {
                'none': null,
                'ChevronRight': ChevronRight,
                'Dot': Dot
            }
        },
        link: {
            control: 'boolean',
            description: "Manually designate the component as a link. Using `href` or `to` will do this automatically."
        },
        to: {
            control: 'text',
            description: 'Instead of using a regular `a` tags with an `href` attribute, ' +
                'use a `to` attribute provided by vue-router\'s `router-link` '
        },
        title: {
            control: 'text'
        }
    },
    args: {
        active: false,
        disabled: false,
        href: '',
        'icon-start': null,
        'icon-end': null,
        to: '',
        title: 'Example list item'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvListItem>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvListItem, Dot, ChevronRight },
        setup() {
            return { args, Dot, ChevronRight };
        },
        template: '<ev-list-item v-bind="args">{{ args.title }}</ev-list-item>'
    })
};