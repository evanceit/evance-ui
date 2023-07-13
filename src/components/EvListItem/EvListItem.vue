<script setup lang="ts">
import './EvListItem.scss';
import {makeEvListItemProps} from "./EvListItem.ts";
import {computed, useAttrs, useSlots} from "vue";
import {useRouterLinkOrHref} from "../../composables/router.ts";

const props = defineProps(makeEvListItemProps());
const attrs = useAttrs();
const slots = useSlots();
const link = useRouterLinkOrHref(props, attrs);
const isLink = computed(() => props.link !== false && link.isLink.value);

function getComponentElement() {
    return isLink.value ? 'a' : props.tag;
}

</script>
<template>
    <component :is="getComponentElement()" class="ev-list-item">
        Item
    </component>
</template>