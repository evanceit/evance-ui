<script setup lang="ts">
import "./EvFieldHelp.scss";
import { makeEvFieldHelpProps } from "./EvFieldHelp";
import { provideDefaults, useDefaults } from "@/composables/defaults";
import { useDisplay } from "@/composables";
import { computed } from "vue";

const definedProps = defineProps({ ...makeEvFieldHelpProps() });
const props = useDefaults(definedProps);
const display = useDisplay();

const breakpoint = computed(() => {
    return props.breakpoint ?? "md";
});

const slots = defineSlots<{
    field(): never;
    help(): never;
}>();

provideDefaults({
    EvCardContent: {
        size: "small",
    },
});

const isShow = computed(() => {
    console.log(breakpoint.value);
    const displayRule = `${breakpoint.value}Up`;
    return display[displayRule]?.value ?? false;
});
</script>

<template>
    <div
        :class="['ev-field-help', { 'is-visible': isShow }, props.class]"
        :style="props.style">
        <div class="ev-field-help--field">
            <slot name="field" />
        </div>
        <div class="ev-field-help--content" :hidden="!isShow">
            <div class="ev-field-help--pointer">
                <div class="ev-field-help--pointer-circle"></div>
                <div class="ev-field-help--pointer-line"></div>
            </div>
            <slot name="help" />
        </div>
    </div>
</template>
