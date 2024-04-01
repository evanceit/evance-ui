<script setup lang="ts">
import './EvTagGroup.scss';
import {EvTagGroupSymbol, makeEvTagGroupProps} from "./EvTagGroup.ts";
import {useGroup} from "@/composables/group.ts";
import {computed} from "vue";

const props = defineProps(makeEvTagGroupProps());

const { isSelected, select, next, prev, selected } = useGroup(props, EvTagGroupSymbol)

const slotProps = computed(() => {
    return {
        isSelected,
        select,
        next,
        prev,
        selected: selected.value
    };
});

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
        <slot v-bind="slotProps" />
    </component>
</template>