<script setup lang="ts">
import "./EvApp.scss";
import { makeEvAppProps } from "./EvApp";
import { provideTheme } from "@/composables/theme";

const props = defineProps({ ...makeEvAppProps() });
const { themeClasses } = provideTheme(props);

</script>

<template>
    <div :class="['ev-application', themeClasses, props.class]">
        <div class="ev-application--container">
            <slot />
        </div>
    </div>
</template>
