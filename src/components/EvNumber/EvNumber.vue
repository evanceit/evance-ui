<script setup lang="ts">
import "./EvNumber.scss";
import { makeEvNumberProps } from "./EvNumber";
import { computed } from "vue";
import { useLocaleManager } from "@/composables";
import { splitNumberToParts } from "@/util";
import EvNumberDigit from "@/components/EvNumber/EvNumberDigit.vue";
import { EvTransitionExpandX } from "@/components/EvTransition/transitions";
import ExpandTransitionGenerator from "@/components/EvTransition/transitions/expandTransition";

const props = defineProps({ ...makeEvNumberProps() });
const localeManager = useLocaleManager();
const formatter = computed(() => {
    return new Intl.NumberFormat(
        localeManager.currentLocale.value,
        props.format,
    );
});

const parts = computed(() =>
    splitNumberToParts(
        props.value,
        formatter.value,
        props.prefix,
        props.suffix,
    ),
);

const allParts = computed(() => [
    ...parts.value.start,
    ...parts.value.integer,
    ...parts.value.fraction,
    ...parts.value.end,
]);

function isDigitPart(
    part: any,
): part is { type: "integer" | "fraction"; value: number } {
    return part.type === "integer" || part.type === "fraction";
}

const transition = ExpandTransitionGenerator("", true);
const duration = computed(() => props.duration ?? 300);
</script>

<template>
    <span
        :class="['ev-number', props.class]"
        :style="[props.style, { '--ev-number-duration': duration + 'ms' }]">
        <transition-group v-bind="transition" name="ev-number-transition">
            <template v-for="part in allParts" :key="part.key">
                <ev-number-digit
                    v-if="isDigitPart(part)"
                    :value="part.value"
                    :class="`is-${part.type}`" />
                <span v-else :class="['ev-number-symbol', `is-${part.type}`]">
                    {{ part.value }}
                </span>
            </template>
        </transition-group>
    </span>
</template>
