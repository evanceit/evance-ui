<script setup lang="ts">
/**
 * # EvListChildren
 *
 * A management component for rendering child items recursively.
 */
import EvListItem from "../EvListItem/EvListItem.vue";



</script>
<template>
    <ev-list-item
        v-for="item in items"
        v-bind="item.props"
    >
    </ev-list-item>
</template>