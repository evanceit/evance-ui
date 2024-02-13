<script setup lang="ts">
import './EvTagGroup.scss';
import {makeEvTagGroupProps} from "./EvTagGroup.ts";

const props = defineProps(makeEvTagGroupProps());

</script>
<template>
    <component
        :is="props.tag"
        :class="[
            'ev-tag-group',
            props.class
        ]"
        :style="props.style"
    >
        Tag Group
    </component>
</template>