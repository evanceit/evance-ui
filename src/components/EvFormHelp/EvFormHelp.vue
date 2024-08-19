<script setup lang="ts">
import "./EvFormHelp.scss";
import { makeEvFormHelpProps } from "./EvFormHelp.ts";
import { EvCardContent } from "@/components/EvCard";
import { computed } from "vue";
import { filterComponentProps } from "@/util";

const props = defineProps({ ...makeEvFormHelpProps() });
const slots = defineSlots<{
    field(): never;
    help(): never;
}>();

const evCardContentProps = computed(() => {
    return filterComponentProps(EvCardContent, props);
});
</script>

<template>
    <div :class="['ev-form-help', props.class]" :style="props.style">
        <div class="ev-form-help--field">
            <slot name="field" />
        </div>
        <div class="ev-form-help--content">
            <div class="ev-form-help--pointer">
                <div class="ev-form-help--pointer-circle"></div>
                <div class="ev-form-help--pointer-line"></div>
            </div>
            <ev-card-content v-bind="evCardContentProps">
                <template v-if="slots.help" #default><slot name="help" /></template>
            </ev-card-content>
        </div>
    </div>
</template>
