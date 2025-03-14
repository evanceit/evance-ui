<script setup lang="ts">
import "./EvApp.scss";
import { makeEvAppProps } from "./EvApp";
import { provideTheme } from "@/composables/theme";
import { computed, onMounted, watch } from "vue";

const props = defineProps({ ...makeEvAppProps() });
const { themeClasses } = provideTheme(props);

const appThemeClasses = computed(() => {
    return props.themeScope === "app" ? themeClasses.value : undefined;
});

const bodyThemeClasses = computed(() => {
    return props.themeScope === "body" ? themeClasses.value : undefined;
});

watch(bodyThemeClasses, (newValue, oldValue) => {
    if (oldValue) {
        document.body.classList.remove(oldValue);
    }
    if (newValue) {
        document.body.classList.add(newValue);
    }
});

onMounted(() => {
    if (bodyThemeClasses.value) {
        document.body.classList.add(bodyThemeClasses.value);
    }
});
</script>

<template>
    <div :class="['ev-application', appThemeClasses, props.class]">
        <div class="ev-application--container">
            <slot />
        </div>
    </div>
</template>
