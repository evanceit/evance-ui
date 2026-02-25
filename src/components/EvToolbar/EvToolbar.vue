<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvTabs } from "@/components/EvTabs";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { ArrowBackIcon, CancelIcon } from "@/icons";
import { computed, getCurrentInstance } from "vue";
import { useModelProxy } from "@/composables/modelProxy";
import { sizeModifier } from "@/util";

const props = defineProps({
    ...makeEvToolbarProps(),
});

const slots = defineSlots<{
    title(): never;
    start(): never;
    end(): never;
}>();

const instance = getCurrentInstance();

const emit = defineEmits(["click:back", "click:close", "update:tab"]);

const hasBackButton = computed(() => {
    return !!instance?.vnode.props?.["onClick:back"];
});

const hasCloseButton = computed(() => {
    return !!instance?.vnode.props?.["onClick:close"];
});

const hasPrefix = computed(() => {
    return hasBackButton.value || props.icon || props.title;
});

function onBackClick($event: MouseEvent) {
    $event.stopPropagation();
    emit("click:back", $event);
}

function onCloseClick($event: MouseEvent) {
    $event.stopPropagation();
    emit("click:close", $event);
}

const tab = useModelProxy(props, "tab");

const sizeClass = computed(() => sizeModifier(props.size));

const tabSize = computed(() => {
    switch (props.size) {
        case "large":
            return "x-large";
        case "small":
            return "medium";
        case "medium":
        default:
            return "large";
    }
});

const actionSize = computed(() => {
    switch (props.size) {
        case "large":
            return "medium";
        case "small":
            return "x-small";
        case "medium":
        default:
            return "small";
    }
});

const isAdjustStart = computed(() => {
    return hasBackButton.value;
});

const isAdjustEnd = computed(() => {
    const hasActions = !!props.actions?.length;
    const variant = props.actions?.at(-1)?.variant ?? "subtle";
    return hasCloseButton.value || (hasActions && variant === "subtle");
});

</script>

<template>
    <component
        :is="props.tag"
        :class="[
            'ev-toolbar',
            {
                'is-adjust-start': isAdjustStart,
                'is-adjust-end': isAdjustEnd,
            },
            sizeClass,
            props.class,
        ]"
        :style="props.style">
        <div class="ev-toolbar--section-start">
            <div v-if="hasPrefix" class="ev-toolbar--prefix">
                <div v-if="hasBackButton" class="ev-toolbar--back" data-no-drag>
                    <ev-button
                        variant="subtle"
                        :icon="ArrowBackIcon"
                        :size="actionSize"
                        @click="onBackClick" />
                </div>

                <div v-if="props.icon" class="ev-toolbar--icon">
                    <ev-icon :glyph="props.icon" />
                </div>

                <div
                    v-if="slots.title || props.title"
                    class="ev-toolbar--title">
                    <slot name="title">{{ props.title }}</slot>
                </div>
            </div>
            <div
                v-if="slots.start || props.tabs"
                class="ev-toolbar--start"
                data-no-drag>
                <slot name="start">
                    <ev-tabs
                        v-model="tab"
                        class="ev-toolbar--tabs"
                        :size="tabSize"
                        :items="props.tabs" />
                </slot>
            </div>
        </div>
        <div class="ev-toolbar--section-end" data-no-drag>
            <div v-if="slots.end || props.actions" class="ev-toolbar--end">
                <slot name="end">
                    <div class="ev-toolbar--actions">
                        <ev-button-group
                            gap="medium"
                            variant="subtle"
                            :size="actionSize"
                            :items="props.actions" />
                    </div>
                </slot>
            </div>
            <div v-if="hasCloseButton" class="ev-toolbar--close">
                <ev-button
                    :size="actionSize"
                    :icon="CancelIcon"
                    variant="subtle"
                    @click="onCloseClick" />
            </div>
        </div>
    </component>
</template>
