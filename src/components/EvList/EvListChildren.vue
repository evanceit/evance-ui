<script setup lang="ts">
/**
 * # EvListChildren
 *
 * A management component for rendering child items recursively.
 */
import EvListItem from "../EvListItem/EvListItem.vue";
import {useSlots} from "vue";
import {makeEvListChildrenProps} from "./EvList.ts";
import {createList} from "../../composables/lists";

const props = defineProps(makeEvListChildrenProps());
const slots = useSlots();

createList();

</script>
<template>
    <slot>
        <template v-for="{ children, props: itemProps, type, raw: item } in props.items">
            <ev-list-item
                v-bind="itemProps"
            ></ev-list-item>
        </template>
    </slot>
</template>