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
import { makeEvListChildrenProps } from "./EvList.ts";
import { createList } from "@/composables/lists";

const props = defineProps({
    ...makeEvListChildrenProps(),
});

createList();
</script>

<template>
    <slot>
        <template v-for="item in props.items" :key="item.key">
            <slot name="item" v-bind="{ item, props: item.props }">
                <ev-list-item v-bind="item.props" />
            </slot>
        </template>
    </slot>
</template>
