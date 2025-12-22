<script setup lang="ts">
import "./EvBanner.scss";
import { makeEvBannerProps } from "./EvBanner";
import { EvIcon } from "@/components/EvIcon";
import { EvButtonProps, EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvText } from "@/components/EvText";
import { computed } from "vue";
import { appearanceIcon } from "@/composables/icons";
import { appearanceModifier, makeClassName } from "@/util";
import { useLocaleFunctions, useModelProxy } from "@/composables";
import { CancelIcon } from "@/icons";

const props = defineProps({
    ...makeEvBannerProps(),
});
const slots = defineSlots<{
    actions(): never;
    default(): never;
    icon(): never;
}>();
const { t } = useLocaleFunctions();

const emit = defineEmits([
    "dismissed",
    "click:dismiss",
    "update:modelValue",
]);

const modelProxy = useModelProxy(props, "modelValue");

const iconGlyph = computed(() => {
    return props.icon ? props.icon : appearanceIcon(props.appearance);
});

const variantModifier = computed(() => {
    return makeClassName(props.variant, "is-variant");
});

const actions = computed(() => {
    if (!props.actions) {
        return [];
    }
    const values = [];
    for (const action of props.actions) {
        const actionDefaults: EvButtonProps = {
            appearance: props.variant === "bold" ? "inverse" : props.appearance,
            variant: "link",
            size: "small",
        };
        values.push(Object.assign(actionDefaults, action));
    }
    return values;
});

/**
 * ## On Click Dismiss
 */
function dismiss(): void {
    modelProxy.value = false;
    emit("click:dismiss");
}

</script>

<template>
    <component
        :is="props.tag"
        v-show="modelProxy"
        :class="[
            'ev-banner',
            variantModifier,
            appearanceModifier(props.appearance),
            props.class,
        ]">
        <div class="ev-banner--icon">
            <slot name="icon">
                <ev-icon :glyph="iconGlyph" />
            </slot>
        </div>
        <div class="ev-banner--content">
            <slot name="default">
                <ev-text
                    :truncate="true"
                    weight="semibold"
                    :text="props.text" />
            </slot>
        </div>
        <div v-if="actions.length || slots.actions" class="ev-banner--actions">
            <slot name="actions">
                <ev-button-group :items="actions" />
            </slot>
        </div>
        <div v-if="props.dismissible" class="ev-banner--dismiss">
            <ev-button
                rounded
                :aria-label="t('dismiss')"
                :icon="CancelIcon"
                size="small"
                variant="subtle"
                @click="dismiss" />
        </div>
    </component>
</template>