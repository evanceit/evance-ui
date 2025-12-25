<script setup lang="ts">
/**
 * # EvListChildren
 *
 * A management component for rendering child items recursively.
 *
 * @todo: nested children + groups
 *        v-for="{ children, props: itemProps, type, raw: item } in props.items"
 */
import EvListItem from "../EvListItem/EvListItem.vue";
import { ListItem, makeEvListChildrenProps } from "./EvList";
import { createList } from "@/composables/lists";
import { EvDivider } from "@/components/EvDivider";
import { EvSection } from "@/components/EvSection";
import { EvListGroup } from "@/components/EvListGroup";

const props = defineProps({
    ...makeEvListChildrenProps(),
});

const slots = defineSlots<{
    default(): never;
    divider(props: { props: any }): never;
    subheader(props: { props: any }): never;
    item(props: { item: ListItem; props: any }): never;
}>();

createList();
</script>

<template>
    <slot name="default">
        <template v-for="item in props.items" :key="item.key">
            <slot
                v-if="item.type === 'divider'"
                name="divider"
                v-bind="{ props: item.props }">
                <ev-divider v-bind="item.props" />
            </slot>
            <slot
                v-else-if="item.type === 'subheader'"
                name="subheader"
                v-bind="{ props: item.props }">
                <ev-section v-bind="item.props" />
            </slot>
            <template v-else-if="item.children">
                <ev-list-group v-bind="item.props">
                    <ev-list-children :items="item.children" />
                </ev-list-group>
            </template>
            <slot v-else name="item" v-bind="{ item, props: item.props }">
                <ev-list-item v-bind="item.props" />
            </slot>
        </template>
    </slot>
</template>
