<script setup lang="ts">
import "./EvToolbar.scss";
import { makeEvToolbarProps } from "./EvToolbar";
import { EvButton } from "@/components/EvButton";
import { EvIcon } from "@/components/EvIcon";
import { EvMenu } from "@/components/EvMenu";
import { EvList } from "@/components/EvList";
import { EvListItem } from "@/components/EvListItem";
import { EvTabs } from "@/components/EvTabs";
import { EvTooltip } from "@/components/EvTooltip";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import {
    ArrowBackIcon,
    BelowRightIcon,
    CancelIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@/icons";
import { computed, getCurrentInstance, Ref, ref } from "vue";
import { useModelProxy } from "@/composables/modelProxy";
import { omit, sizeModifier } from "@/util";
import { DisplayInstance, IconValue, useDisplay } from "@/composables";
import { toDisplayStateKey } from "@/composables/display";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
    ...makeEvToolbarProps(),
});

const slots = defineSlots<{
    title(): never;
    start(): never;
    end(): never;
}>();

const instance = getCurrentInstance();
const display = useDisplay();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(["click:back", "click:close", "update:tab"]);

const hasBackButton = computed(() => {
    return !!instance?.vnode.props?.["onClick:back"];
});

const hasCloseButton = computed(() => {
    return !!instance?.vnode.props?.["onClick:close"];
});

const hasPrefix = computed(() => {
    return (
        hasBreadcrumbs.value || hasBackButton.value || props.icon || props.title
    );
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

const crumbsButton = ref();
const hasBreadcrumbs = computed(() => !!props.breadcrumbs?.length);
const currentTab = computed(() => {
    const linkResult = tabs.value.find((item) => isTabActiveLink(item));
    return linkResult ?? tabs.value.find((item) => item.index === tab.value);
});

function isTabActiveLink(item: any) {
    if (!item.to) {
        return false;
    }
    const resolved = router.resolve(item.to);
    if (item.exact) {
        return resolved.path === route.path;
    }
    return (
        route.path === resolved.path ||
        route.path.startsWith(resolved.path + "/")
    );
}

const tabs = computed(() => {
    let index = -1;
    return props.tabs?.map((tab) => ({
        ...tab,
        index: ++index,
        icon: undefined,
        selectedIcon: undefined,
        iconStart: tab.iconStart ?? (tab.icon as IconValue),
        selectedIconStart: tab.selectedIconStart ?? tab.selectedIcon,
    }));
});

const menuItems = computed(() => {
    return tabs.value.map((tab) => ({
        props: {
            ...omit(tab, ["index"]),
        },
        title: tab.text,
        index: tab.index,
        value: tab.index,
    }));
});
const menuItemSelected = computed(() => {
    return [menuItems.value[currentTab.value.index]];
});

const showTabs = computed(() => {
    if (props.tabsDisplay === "tabs") {
        return true;
    }
    if (props.tabsDisplay === "menu") {
        return false;
    }
    // Auto
    const displayKey = toDisplayStateKey(props.tabsBreakpoint);
    const showable = display[
        displayKey as keyof DisplayInstance
    ] as Ref<boolean>;
    return showable.value;
});

function selectMenuItem(selected) {
    const selectedItem = selected[0]?.index ?? undefined;
    if (selectedItem !== undefined) {
        tab.value = selected[0]?.index;
    }
}
</script>

<template>
    <component
        :is="props.tag"
        :class="['ev-toolbar', sizeClass, props.class]"
        :style="props.style">
        <div class="ev-toolbar--section-start">
            <div v-if="hasPrefix" class="ev-toolbar--prefix">
                <div
                    v-if="hasBreadcrumbs"
                    class="ev-toolbar--crumbs"
                    data-no-drag>
                    <ev-button
                        ref="crumbsButton"
                        variant="subtle"
                        :icon="ChevronDownIcon"
                        :size="actionSize" />
                    <ev-tooltip
                        :activator="crumbsButton"
                        text="Show navigation path"
                        position="top" />
                    <ev-menu
                        min-width="280"
                        max-width="320"
                        :activator="crumbsButton">
                        <ev-list>
                            <ev-list-item
                                v-for="breadcrumb in props.breadcrumbs"
                                :key="breadcrumb.title"
                                :href="breadcrumb.href"
                                :to="breadcrumb.to"
                                :title="breadcrumb.title"
                                :active="false">
                                <template #iconStart>
                                    <ev-icon
                                        :glyph="
                                            breadcrumb.icon ?? BelowRightIcon
                                        "
                                        appearance="subtle" />
                                </template>
                            </ev-list-item>
                        </ev-list>
                    </ev-menu>
                </div>

                <div
                    v-else-if="hasBackButton"
                    class="ev-toolbar--back"
                    data-no-drag>
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
                        v-if="showTabs"
                        v-model="tab"
                        class="ev-toolbar--tabs"
                        :size="tabSize"
                        :items="tabs" />

                    <ev-menu v-else>
                        <template #activator="{ props, isActive }">
                            <ev-button
                                v-bind="props"
                                class="ev-toolbar--menu-button"
                                :appearance="isActive ? 'primary' : 'default'"
                                :variant="isActive ? 'tonal' : 'subtle'"
                                :size="actionSize"
                                :icon-start="
                                    currentTab?.selectedIconStart ?? currentTab?.iconStart
                                "
                                :icon-end="
                                    isActive ? ChevronUpIcon : ChevronDownIcon
                                "
                                :text="currentTab?.text" />
                        </template>
                        <ev-list
                            select-strategy="single-any"
                            return-object
                            :items="menuItems"
                            :selected="menuItemSelected"
                            @update:selected="selectMenuItem">
                        </ev-list>
                    </ev-menu>
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
