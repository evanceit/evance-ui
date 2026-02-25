<script setup lang="ts">
import "./EvCardActions.scss";
import { makeEvCardActionsProps } from "./EvCardActions";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { computed } from "vue";
import { makeClassName, sizeModifier } from "@/util";
import { useDefaults } from "@/composables";

const definedProps = defineProps({
    ...makeEvCardActionsProps(),
});
const props = useDefaults(definedProps);
const slots = defineSlots<{
    default(): never;
}>();
const justifyClass = computed(() => makeClassName(props.justify, "justify"));
const sizeClass = computed(() => sizeModifier(props.size));
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-card-actions', justifyClass, sizeClass, props.class]"
        :style="props.style">
        <ev-button-group
            :grow="props.grow"
            :size="props.size"
            :items="props.items">
            <slot name="default" />
        </ev-button-group>
    </component>
</template>
