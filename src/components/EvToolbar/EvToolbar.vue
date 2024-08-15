<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar.ts";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvTabs } from "@/components/EvTabs";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { ArrowBackIcon, CancelIcon } from "@/icons";
import { computed, getCurrentInstance } from "vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { sizeModifier } from "@/util";

const props = defineProps({
    ...makeEvToolbarProps(),
});

const slots = defineSlots<{
    start(): never;
    end(): never;
}>();

const instance = getCurrentInstance();

const emit = defineEmits(["click:back", "click:close", "update:tab"]);

const hasBackButton = computed(() => {
    return !!instance?.vnode.props["onClick:back"];
});

const hasCloseButton = computed(() => {
    return !!instance?.vnode.props["onClick:close"];
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

</script>

<template>
    <div :class="['ev-toolbar', sizeClass, props.class]" :style="props.style">
        <div class="ev-toolbar--section-start">
            <div v-if="hasPrefix" class="ev-toolbar--prefix">
                <div v-if="hasBackButton" class="ev-toolbar--back">
                    <ev-button
                        rounded
                        size="small"
                        variant="subtle"
                        :icon="ArrowBackIcon"
                        @click="onBackClick" />
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
                    <ev-tabs
                        v-model="tab"
                        :size="tabSize"
                        :items="props.tabs" />
                </slot>
            </div>
        </div>
        <div class="ev-toolbar--section-end">
            <div v-if="slots.end || props.actions" class="ev-toolbar--end">
                <slot name="end">
                    <div class="ev-toolbar--actions">
                        <ev-button-group
                            gap="medium"
                            :items="props.actions"
                            :size="actionSize" />
                    </div>
                </slot>
            </div>
            <div v-if="hasCloseButton" class="ev-toolbar--close">
                <ev-button
                    rounded
                    size="small"
                    :icon="CancelIcon"
                    variant="subtle"
                    @click="onCloseClick" />
            </div>
        </div>
    </div>
</template>
