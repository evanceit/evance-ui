<script setup lang="ts">

import EvListItem from "../EvListItem/EvListItem.vue";
</script>
<template>
    <ev-list-item
        v-for="item in items"
        v-bind="item.props"
    >
    </ev-list-item>
</template>