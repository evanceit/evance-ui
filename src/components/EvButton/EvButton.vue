<script setup lang="ts">
/**
 * # EvButton
 */
import "./EvButton.scss";
import { makeEvButtonProps } from "./EvButton.ts";
import { computed, useAttrs, useSlots } from "vue";
import { EvIcon } from "@/components/EvIcon";
import { EvProgressCircular } from "@/components/EvProgressCircular";
import {
    AppearanceProps,
    InputSize,
    isBoolean,
    sizeModifier,
    useAppearance,
    Variant,
} from "@/util";
import { hasSlotWithContent } from "@/composables/hasSlotWithContent.ts";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router.ts";
import { useDefaults } from "@/composables/defaults.ts";
import { useGroupItem } from "@/composables/groupItem.ts";
import { useSelectLink } from "@/composables/selectLink.ts";

defineSlots<{
    default(): never;
    icon(): never;
    "icon-end"(): never;
    "icon-start"(): never;
    prefix(): never;
    suffix(): never;
}>();

const definedProps = defineProps(makeEvButtonProps());
const props = useDefaults(definedProps);

defineEmits(["group:selected"]);

const attrs = useAttrs();
const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, "default");
const group = useGroupItem(props, props.symbol, false);
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);

const isActive = computed(() => {
    if (props.active !== undefined) {
        return props.active;
    }
    if (link.isLink.value) {
        return link.isActive?.value;
    }
    return group?.isSelected.value;
});

const isDisabled = computed(() => {
    // we'll add groups later
    return group?.disabled.value || props.disabled;
});

const isClickable = computed(() => {
    return !isDisabled.value && !props.loading;
});

/**
 * ## Is Icon Like?
 *
 * Used to determine whether to apply `is-icon` modifier class.
 *
 * Returns `true` if only one icon is applied, the button is not full-width
 * and no text has been supplied.
 *
 * OR, the `icon` prop is supplied as `true`.
 */
const isIconLike = computed(() => {
    const icons = [props.icon, props.iconStart, props.iconEnd].filter(
        (icon) => !!icon,
    );
    return (
        ((icons.length === 1 && !hasDefaultSlot.value && !props.text) ||
            props.icon === true) &&
        !props.fullWidth
    );
});

/**
 * ## Is Link?
 * Returns `true` if an `href` was supplied AND is NOT an empty string.
 */
const isLink = computed(() => {
    return link.isLink.value;
});

/**
 * ## Component Element
 *
 * An `<ev-button>` may render as:
 * - `<a>` when an `href` is supplied
 * - `<button>` when `href` is NOT supplied, or is an empty string
 */
const componentElement = computed(() => {
    return isLink.value ? "a" : "button";
});

/**
 * # On Click
 * @param e
 */
function onClick(e: MouseEvent): void {
    if (
        isDisabled.value ||
        (isLink.value &&
            (e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.button !== 0 ||
                attrs.target === "_blank"))
    ) {
        return;
    }
    link.navigate?.(e);
    group?.toggle();
}

useSelectLink(link, group?.select);

const { appearanceClass, variantClass } = useAppearance(
    props as AppearanceProps,
    group,
    isActive,
    Variant.bold,
);

const valueAttr = computed(() => {
    if (props.value === undefined || typeof props.value === "symbol") {
        return undefined;
    }
    return Object(props.value) === props.value
        ? JSON.stringify(props.value, null, 0)
        : props.value;
});

defineExpose({
    group,
});
</script>

<template>
    <component
        :is="componentElement"
        :href="link.href.value"
        :class="[
            'ev-button',
            group?.selectedClass.value,
            appearanceClass,
            variantClass,
            sizeModifier(props.size as string, [InputSize.default]),
            {
                'is-active': isActive,
                'is-disabled': isDisabled,
                'is-icon': isIconLike,
                'is-fullwidth': props.fullWidth,
                'is-loading': props.loading,
                'is-rounded': props.rounded,
                'is-clickable': isClickable,
            },
            props.class,
        ]"
        :style="props.style"
        tabindex="0"
        :disabled="isDisabled || undefined"
        :value="valueAttr"
        @click="onClick">
        <span
            v-if="props.iconStart || slots['icon-start']"
            class="ev-button--icon-start">
            <slot name="icon-start">
                <ev-icon :glyph="props.iconStart" />
            </slot>
        </span>
        <span v-if="slots.prefix" class="ev-button--prefix">
            <slot name="prefix" />
        </span>
        <span
            v-if="(props.icon || slots.icon) && !isBoolean(props.icon)"
            class="ev-button--icon">
            <slot name="icon">
                <ev-icon :glyph="props.icon" />
            </slot>
        </span>
        <span
            v-if="props.text || hasDefaultSlot"
            class="ev-button--text"
            data-no-activator>
            <slot>{{ props.text }}</slot>
        </span>
        <span v-if="slots.suffix" class="ev-button--suffix">
            <slot name="suffix" />
        </span>
        <span
            v-if="props.iconEnd || slots['icon-end']"
            class="ev-button--icon-end">
            <slot name="icon-end">
                <ev-icon :glyph="props.iconEnd" />
            </slot>
        </span>
        <span v-if="props.loading" class="ev-button--loading">
            <ev-progress-circular indeterminate />
        </span>
    </component>
</template>
