<script setup lang="ts">
import "./EvListItem.scss";
import { makeEvListItemProps } from "./EvListItem";
import { computed, mergeProps, toDisplayString, useAttrs } from "vue";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router";
import { useList, useNestedListItem } from "@/composables/lists";
import { EvIcon } from "@/components/EvIcon";
import { EvButton } from "@/components/EvButton";
import { EvButtonGroup } from "@/components/EvButtonGroup";
import { EvText } from "@/components/EvText";
import { EvProgressCircular } from "@/components/EvProgressCircular";
import { getNextId } from "@/util";
import { ChevronRightIcon, DotIcon } from "@/icons";
import { useModelProxy } from "@/composables";
import EvListChildren from "@/components/EvList/EvListChildren.vue";
import { EvTransition } from "@/components/EvTransition";
import ExpandTransitionGenerator from "@/components/EvTransition/transitions/expandTransition";

// Emit
const emit = defineEmits(["click"]);

const props = defineProps({
    ...makeEvListItemProps(),
});
const slots = defineSlots<{
    default(): never;
    iconStart(): never;
    iconEnd(): never;
    prefix(): never;
    suffix(): never;
    children(): never;
}>();

const attrs = useAttrs();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const list = useList();
const id = computed(() =>
    props.value === undefined ? link.href.value : props.value,
);
const isLoading = useModelProxy(props, "loading");
const { select, isSelected, isLeaf, isOpen, open } = useNestedListItem(id, false);
const isLink = computed(() => props.link !== false && link.isLink.value);
const isClickable = computed(() => {
    return (
        !props.disabled &&
        props.link !== false &&
        (props.link ||
            link.isClickable.value ||
            (props.value != null && !!list))
    );
});
const isActive = computed(() => {
    return props.active !== false && (props.active || link.isActive?.value);
});
const isActiveExact = computed(() => {
    return (
        props.exact !== false &&
        (props.exact || link.isExactActive?.value || isSelected.value)
    );
});
const itemElement = computed(() => {
    return isLink.value ? "a" : props.tag;
});
const tabIndex = computed(() => {
    return isClickable.value ? (list ? -2 : 0) : null;
});

/**
 * # onClick Handler
 * @param e
 */
function onClick(e: MouseEvent): void {
    emit("click", e);
    if (!isClickable.value) {
        return;
    }
    link.navigate?.(e);
    if (props.value != null) {
        select(!isSelected.value, e);
    }
}

/**
 * # onKeyDown Handler
 * @param e
 */
function onKeyDown(e: KeyboardEvent): void {
    e.preventDefault();
    onClick(e as any as MouseEvent);
}

const hasClickListener = computed(
    () => !!link.isClickable.value || !!props.onClick,
);

const titleProps = computed(() => {
    return mergeProps(
        {
            truncate: true,
            text: toDisplayString(props.title),
        },
        props.titleProps,
    );
});

const subtitleProps = computed(() => {
    return mergeProps(
        {
            appearance: "subtle",
            size: "small",
            truncate: true,
            text: toDisplayString(props.subtitle),
        },
        props.subtitleProps,
    );
});

const parsedActions = computed(() =>
    props.actions.map((action) => ({
        props: action,
        id: getNextId(),
    })),
);
const hasActions = computed(() => !!parsedActions.value.length);
const parsedActionsOnHover = computed(() =>
    props.actionsOnHover.map((action) => ({
        props: action,
        id: getNextId(),
    })),
);
const hasActionsOnHover = computed(() => !!parsedActionsOnHover.value.length);


const transition = ExpandTransitionGenerator("", false);
const hasChildren = computed(() => {
    return !!slots.children || !!props.children;
});
const showCaret = computed(() => {
    return isLoading.value || hasChildren.value;
});

function onClickOpener(e: Event) {
    open(!isOpen.value, e);
}

</script>

<template>
    <li class="ev-list-item">
        <div
            role="listitem"
            :class="[
                'ev-list-item-content',
                {
                    'is-active': isActive,
                    'is-active--exact': isActiveExact,
                    'is-clickable': isClickable || hasClickListener,
                    'is-disabled': props.disabled,
                    'is-actions-on-hover': hasActionsOnHover,
                    'is-open': isOpen,
                },
                props.class,
            ]"
            :style="props.style">
            <component
                :is="itemElement"
                :href="link.href.value"
                :tabindex="tabIndex"
                class="ev-list-item--button"
                @click="onClick"
                @keydown.enter="onKeyDown"
                @keydown.space="onKeyDown">
                <div class="ev-list-item--label">
                    <slot name="default">
                        <ev-text
                            tag="div"
                            class="ev-list-item--title"
                            v-bind="titleProps" />
                        <ev-text
                            v-if="props.subtitle"
                            tag="div"
                            class="ev-list-item--subtitle"
                            v-bind="subtitleProps" />
                    </slot>
                </div>
                <div aria-hidden="true" class="ev-list-item--indicator"></div>
            </component>
            <!-- todo: change caret to nest -->
            <div v-if="showCaret" class="ev-list-item--caret">
                <ev-progress-circular v-if="isLoading" indeterminate />
                <ev-button
                    icon
                    size="x-small"
                    variant="subtle"
                    :icon-start="ChevronRightIcon"
                    @click="onClickOpener" />
                <ev-icon :glyph="DotIcon" />
                <!-- todo: handle loading, and leaf (if wanted) -->
            </div>
            <div
                v-if="slots.iconStart || props.iconStart"
                class="ev-list-item--icon-start">
                <slot name="iconStart">
                    <ev-icon :glyph="props.iconStart" />
                </slot>
            </div>
            <div v-if="slots.prefix" class="ev-list-item--prefix">
                <slot name="prefix" />
            </div>
            <div v-if="slots.suffix" class="ev-list-item--suffix">
                <slot name="suffix" />
            </div>
            <div
                v-if="hasActions || hasActionsOnHover"
                class="ev-list-item--actions">
                <ev-button-group size="x-small" variant="subtle">
                    <ev-button
                        v-for="action in parsedActionsOnHover"
                        :key="action.id"
                        v-bind="action.props"
                        class="is-show-on-hover" />
                    <ev-button
                        v-for="action in parsedActions"
                        :key="action.id"
                        v-bind="action.props" />
                </ev-button-group>
            </div>
            <div
                v-if="slots.iconEnd || props.iconEnd"
                class="ev-list-item--icon-end">
                <slot name="iconEnd">
                    <ev-icon :glyph="props.iconEnd" />
                </slot>
            </div>
        </div>

        <template v-if="hasChildren">
            <ev-transition name="ev-list-group-transition" v-bind="transition">
                <ul
                    v-show="isOpen"
                    class="ev-list-item-children"
                    role="group">
                    <slot name="children">
                        <ev-list-children :items="props.children" />
                    </slot>
                </ul>
            </ev-transition>
        </template>
    </li>
</template>
