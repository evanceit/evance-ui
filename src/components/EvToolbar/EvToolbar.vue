<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar.ts";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvTabs } from "@/components/EvTabs";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { ArrowBackIcon, CancelIcon } from "@/icons";
import { computed } from "vue";

const props = defineProps({
    ...makeEvToolbarProps(),
});

const slots = defineSlots<{
    start(): never;
    end(): never;
}>();

const hasBackButton = computed(() => {
    return true;
});

const hasCloseButton = computed(() => {
    return true;
});
</script>

<template>
    <div class="ev-toolbar">
        <div class="ev-toolbar--section-start">
            <div class="ev-toolbar--prefix">
                <div v-if="hasBackButton" class="ev-toolbar--back">
                    <ev-button
                        rounded
                        size="small"
                        variant="subtle"
                        :icon="ArrowBackIcon" />
                </div>

                <div v-if="props.icon" class="ev-toolbar--icon">
                    <ev-icon :glyph="props.icon" />
                </div>

                <div v-if="props.title" class="ev-toolbar--title">
                    {{ props.title }}
                </div>
            </div>
            <div v-if="slots.start || props.tabs" class="ev-toolbar--start">
                <slot name="start">
                    <ev-tabs size="x-large" :items="props.tabs" />
                </slot>
            </div>
        </div>
        <div class="ev-toolbar--section-end">
            <div v-if="slots.end || props.actions" class="ev-toolbar--end">
                <slot name="end">
                    <div class="ev-toolbar--actions">
                        <ev-button-group :items="props.actions" />
                    </div>
                </slot>
            </div>
            <div v-if="hasCloseButton" class="ev-toolbar--close">
                <ev-button
                    rounded
                    size="small"
                    :icon="CancelIcon"
                    variant="subtle" />
            </div>
        </div>
    </div>
</template>
