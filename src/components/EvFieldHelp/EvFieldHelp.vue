<script setup lang="ts">
import "./EvFieldHelp.scss";
import { makeEvFieldHelpProps } from "./EvFieldHelp.ts";
import { provideDefaults } from "@/composables/defaults.ts";

const props = defineProps({ ...makeEvFieldHelpProps() });
const slots = defineSlots<{
    field(): never;
    help(): never;
}>();

provideDefaults({
    EvCardContent: {
        size: "small",
    },
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
            <slot name="help" />
        </div>
    </div>
</template>
