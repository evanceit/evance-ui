import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSelect } from "@/components/EvSelect";
import { EvListItem } from "@/components/EvListItem";
import { EvDivider } from "@/components/EvDivider";
import EvTextfieldStories from "@/components/EvTextfield/EvTextfield.stories.ts";
import {omit} from "@/util";
import {Plus} from "@/icons";

const meta: Meta<typeof EvSelect> = {
    component: EvSelect,
    title: 'Forms/EvSelect',
    argTypes: {

        modelValue: {
            description: "The `model-value` is the `v-model` value of the component."
        },
        multiple: {
            control: 'boolean'
        },
        itemsEmptyText: {
            control: 'text',
            description: "Change the text that appears when no items are available, or use the `no-items` slot. Defaults to the `select.noItemsText` locale translation path."
        },
        openOnClear: {
            control: 'boolean'
        },
        returnObject: {
            control: 'boolean',
            description: "When `true` the `v-model` bound to the EvSelect will receive the full item instead of the item's value."
        },

        ...omit(EvTextfieldStories.argTypes as any, [
            'align',
            'iconEnd',
            'modelValue',
            'monospace',
            'type'
        ])
    },
    args: {
        modelValue: undefined,
        multiple: false,
        itemsEmptyText: undefined,
        openOnClear: false,
        returnObject: false,

        ...omit(EvTextfieldStories.args as any, [
            'align',
            'iconEnd',
            'modelValue',
            'monospace',
            'type'
        ])

    }
};

export default meta;

type Story = StoryObj<typeof EvSelect>;

/**
 * ## generateItemList
 * @param amount
 */
function generateItemList(amount: number) {
    const items = [];
    for (let i = 0; i < amount; i++) {
        const num = i + 1;
        items.push({
            title: `Example Test Item ${num}`,
            value: num
        });
    }
    return items;
}

/**
 * ## Primary Story
 */
export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSelect },
        data() {
            return {
                selected: null
            }
        },
        setup() {

            const items = generateItemList(1000);

            const requiredValidator = (value: any) => {
                if (!value) {
                    return 'Required';
                }
                return true;
            };

            return { args, items, requiredValidator };
        },
        template: `<ev-select v-bind="args" v-model="selected" :items="items" :validators="[requiredValidator]" />`
    })
};


/**
 * ## Items Affix Story
 */
export const ItemsAffix: Story = {
    render: (args: any) =>  ({
        components: { EvSelect, EvListItem, EvDivider, Plus },
        data() {
            return {
                selected: null
            }
        },
        setup() {
            const items = generateItemList(10);
            return { items, Plus };
        },
        template: `
            <ev-select :items="items">
                <template #items-prefix>
                    <ev-list-item>Available items</ev-list-item>
                    <ev-divider />
                </template>
                <template #items-suffix>
                    <ev-divider />
                    <ev-list-item :icon-start="Plus" :link="true">Add a new item</ev-list-item>
                </template>
            </ev-select>
            `
    })
};

/**
 * ## Custom Item Story
 */
export const CustomItem: Story = {
    render: (args: any) =>  ({
        components: { EvSelect, EvListItem, EvDivider, Plus },
        data() {
            return {
                selected: null
            }
        },
        setup() {
            const items = generateItemList(10);
            return { items, Plus };
        },
        template: `
            <ev-select :items="items">
                <template #item="{item, index, props}">
                    <ev-list-item v-bind="props" :title="item.title" :link="true"></ev-list-item>
                </template>
            </ev-select>
            `
    })
};