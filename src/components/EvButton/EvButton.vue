<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import {makeEvButtonProps} from "./EvButton.ts";
import {computed, useAttrs, useSlots} from "vue";
import {EvIcon} from "@/components/EvIcon";
import {EvProgressCircular} from "@/components/EvProgressCircular";
import {appearanceModifier, InputSize, sizeModifier, variantModifier} from "@/util";
import {hasSlotWithContent} from "@/composables/hasSlotWithContent.ts";
import {RouterLinkOrHrefProps, useRouterLinkOrHref} from "@/composables/router.ts";
import {useDefaults} from "@/composables/defaults.ts";
import {useGroupItem} from "@/composables/groupItem.ts";
import {useSelectLink} from "@/composables/selectLink.ts";

defineSlots<{
    default(): any,
    icon(): any,
    'icon-end'(): any,
    'icon-start'(): any,
    prefix(): any,
    suffix(): any,
}>();

const definedProps = defineProps(makeEvButtonProps());
const props = useDefaults(definedProps, 'EvButton');

defineEmits([
    'group:selected'
]);

const attrs = useAttrs();
const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');
const group = useGroupItem(props as any, props.symbol, false);
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
    return (group?.disabled.value || props.disabled);
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
    const icons = [props.icon, props.iconStart, props.iconEnd].filter((icon) => !!icon);
    return (
            (
                icons.length === 1
                && !hasDefaultSlot.value
                && !props.text
            )
            || props.icon === true
        )
        && !props.fullWidth;
});


/**
 * ## Get Component Element
 *
 * An `<ev-button>` may render as:
 * - `<a>` when an `href` is supplied
 * - `<button>` when `href` is NOT supplied, or is an empty string
 */
function getComponentElement() {
    return isLink() ? 'a' : 'button';
}

/**
 * ## Is Link?
 * Returns `true` if an `href` was supplied AND is NOT an empty string.
 */
function isLink() {
    return (link.isLink.value);
}

/**
 * # On Click
 * @param e
 */
function onClick(e: MouseEvent): void {
    if (
        isDisabled.value
        || (
            isLink()
            && (
                e.metaKey
                || e.ctrlKey
                || e.shiftKey
                || e.button !== 0
                || attrs.target === '_blank'
            )
        )
    ) {
        return;
    }
    link.navigate?.(e);
    group?.toggle();
}

useSelectLink(link, group?.select);

</script>
<template>
    <component
        :is="getComponentElement()"
        :href="link.href.value"
        :class="[
            'ev-button',
            appearanceModifier(props.appearance),
            variantModifier(props.variant),
            sizeModifier(props.size as string, [InputSize.default]),
            {
                'is-active': isActive,
                'is-disabled': isDisabled,
                'is-icon': isIconLike,
                'is-fullwidth': props.fullWidth,
                'is-loading': props.loading,
                'is-rounded': props.rounded
            },
            props.class
        ]"
        :style="props.style"
        tabindex="0"
        :disabled="isDisabled || undefined"
        @click="onClick"
    >
        <span class="ev-button--icon-start" v-if="props.iconStart || slots['icon-start']">
            <slot name="icon-start">
                <ev-icon :glyph="props.iconStart" />
            </slot>
        </span>
        <span class="ev-button--prefix" v-if="slots.prefix">
            <slot name="prefix" />
        </span>
        <span class="ev-button--icon" v-if="(props.icon || slots.icon) && props.icon !== true">
            <slot name="icon">
                <ev-icon :glyph="props.icon" />
            </slot>
        </span>
        <span class="ev-button--text" v-if="props.text || hasDefaultSlot" data-no-activator>
            <slot>{{ props.text }}</slot>
        </span>
        <span class="ev-button--suffix" v-if="slots.suffix">
            <slot name="suffix" />
        </span>
        <span class="ev-button--icon-end" v-if="props.iconEnd || slots['icon-end']">
            <slot name="icon-end">
                <ev-icon :glyph="props.iconEnd" />
            </slot>
        </span>
        <span class="ev-button--loading" v-if="props.loading">
            <ev-progress-circular indeterminate />
        </span>
    </component>
</template>