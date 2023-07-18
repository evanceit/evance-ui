import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSurface } from "../EvSurface";

const meta: Meta<typeof EvSurface> = {
    component: EvSurface,
    argTypes: {
        elevation: {
            control: 'select',
            options: ['default', 'panel', 'overlay', 'sunken']
        },
        rounded: {
            control: 'select',
            options: ['false', 'true', 'small', 'medium', 'large'],
            mapping: {
                'false': false,
                'true': true
            }
        },
        scrollable: {
            control: 'select',
            options: ['undefined', 'false', 'true', 'x', 'y'],
            mapping: {
                'undefined': undefined,
                'true': true,
                'false': false,
                'x': 'x',
                'y': 'y'
            }
        }
    },
    args: {
        elevation: 'default',
        rounded: false,
        scrollable: undefined
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSurface>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSurface },
        setup() {
            return { args };
        },
        template: '<ev-surface v-bind="args" width="200" height="200">' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nec dictum ex, et sodales elit. Vivamus ex nulla, eleifend ac condimentum vitae, rutrum ac dolor. Suspendisse sit amet nunc et eros elementum consequat blandit in est. Fusce blandit ornare nibh, ut egestas diam auctor sed. Mauris ligula tellus, faucibus vel nisl id, vehicula ornare est. Nulla fringilla luctus neque, quis rhoncus nibh facilisis nec. Donec neque tellus, sollicitudin id erat vel, tempor placerat nulla. Curabitur tristique nunc urna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sagittis hendrerit imperdiet. Suspendisse ligula orci, cursus vitae massa et, semper ornare enim.</p>' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque nec dictum ex, et sodales elit. Vivamus ex nulla, eleifend ac condimentum vitae, rutrum ac dolor. Suspendisse sit amet nunc et eros elementum consequat blandit in est. Fusce blandit ornare nibh, ut egestas diam auctor sed. Mauris ligula tellus, faucibus vel nisl id, vehicula ornare est. Nulla fringilla luctus neque, quis rhoncus nibh facilisis nec. Donec neque tellus, sollicitudin id erat vel, tempor placerat nulla. Curabitur tristique nunc urna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sagittis hendrerit imperdiet. Suspendisse ligula orci, cursus vitae massa et, semper ornare enim.</p>' +
            '</ev-surface>'
    })
};