<script setup lang="ts">
import "./EvFieldHelp.scss";
import { makeEvFieldHelpProps } from "./EvFieldHelp.ts";
import { EvCardContent } from "@/components/EvCard";
import { computed } from "vue";
import { filterComponentProps } from "@/util";

const props = defineProps({ ...makeEvFieldHelpProps() });
const slots = defineSlots<{
    field(): never;
    help(): never;
}>();

const evCardContentProps = computed(() => {
    return filterComponentProps(EvCardContent, props);
});
</script>

<template>
    <div :class="['ev-field-help', props.class]" :style="props.style">
        <div class="ev-field-help--field">
            <slot name="field" />
        </div>
        <div class="ev-field-help--content">
            <div class="ev-field-help--pointer">
                <div class="ev-field-help--pointer-circle"></div>
                <div class="ev-field-help--pointer-line"></div>
            </div>
            <ev-card-content v-bind="evCardContentProps">
                <template v-if="slots.help" #default><slot name="help" /></template>
            </ev-card-content>
        </div>
    </div>
</template>
