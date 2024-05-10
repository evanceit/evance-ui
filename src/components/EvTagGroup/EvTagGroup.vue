<script setup lang="ts">
import "./EvTagGroup.scss";
import {
    EvTagGroupSlots,
    EvTagGroupSymbol,
    makeEvTagGroupProps,
} from "./EvTagGroup.ts";
import { GroupProps, useGroup } from "@/composables/group.ts";
import { computed, toRef } from "vue";
import { provideDefaults } from "@/composables/defaults.ts";
import { filterComponentProps } from "@/util";
import { EvSlideGroup } from "@/components/EvSlideGroup";

const props = defineProps({
    ...makeEvTagGroupProps(),
});

const { isSelected, select, next, previous, selected } = useGroup(
    props as any as GroupProps,
    EvTagGroupSymbol,
);

defineSlots<EvTagGroupSlots>();

const slotProps = computed(() => {
    return {
        isSelected,
        select,
        next,
        previous,
        selected: selected.value,
    };
});

provideDefaults({
    EvTag: {
        disabled: toRef(props, "disabled"),
        filter: toRef(props, "filter"),
    },
});

const slideGroupProps = computed(() =>
    filterComponentProps(EvSlideGroup, props),
);
</script>

<template>
    <ev-slide-group
        v-bind="slideGroupProps"
        :class="[
            'ev-tag-group',
            {
                'is-column': props.column,
            },
            props.class,
        ]"
        :style="props.style">
        <slot v-bind="slotProps" />
    </ev-slide-group>
</template>
