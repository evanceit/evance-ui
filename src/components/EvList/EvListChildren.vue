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
        <ev-list-item
            v-for="item in props.items"
            v-bind="item.props"
        >
        </ev-list-item>
    </slot>
</template>