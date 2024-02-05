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
import {makeEvListChildrenProps} from "./EvList.ts";
import {createList} from "@/composables/lists";

const props = defineProps(makeEvListChildrenProps());

createList();

</script>
<template>
    <slot>
        <template v-for="{ props: itemProps } in props.items">
          <slot name="item" v-bind="{ props: itemProps}">
            <ev-list-item
                v-bind="itemProps"
            ></ev-list-item>
          </slot>
        </template>
    </slot>
</template>