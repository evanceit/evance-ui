import type {Meta, StoryObj} from "@storybook/vue3";

import {EvTab, EvTabs} from "../EvTabs";
import {SalesEnquiry, SalesEnquiryFill, SalesOrder, SalesOrderFill, SalesQuotation, SalesQuotationFill} from "@/icons";
import {shallowRef} from "vue";

const meta: Meta<typeof EvTabs> = {
    component: EvTabs,
    argTypes: {
        alignTabs: {
            control: 'select',
            options: ['start', 'center', 'end']
        },
        direction: {
            control: 'select',
            options: ['horizontal', 'vertical']
        },
        grow: {
            control: 'boolean'
        },
        size: {
            control: 'select',
            options: ['x-small', 'small', 'medium', 'large', 'x-large'],
            description: 'Changes the size of the tab, which may be either `small`, `medium`, or `large`. \n\n' +
                'Defaults to `medium`.'
        },
    },
    args: {
        alignTabs: 'start',
        direction: 'horizontal',
        grow: false,
        size: 'medium'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTabs>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTabs, EvTab },
        setup() {
            const selection = shallowRef(1);

            return {
                args,
                selection,
                SalesOrder,
                SalesOrderFill,
                SalesEnquiry,
                SalesEnquiryFill,
                SalesQuotation,
                SalesQuotationFill
            };
        },
        template: `
            <ev-tabs v-bind="args" v-model="selection">
                <ev-tab 
                    text="Orders" 
                    :value="1" 
                    :icon-start="selection == 1 ? SalesOrderFill : SalesOrder" />
                <ev-tab 
                    text="Enquiries" 
                    :value="2" 
                    :icon-start="selection == 2 ? SalesEnquiryFill : SalesEnquiry"  />
                <ev-tab 
                    text="Quotes" 
                    :value="3" 
                    :icon-start="selection == 3 ? SalesQuotationFill : SalesQuotation"  />
            </ev-tabs>
        `
    })
};