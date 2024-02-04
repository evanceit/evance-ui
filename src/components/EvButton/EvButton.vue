<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import {makeEvButtonProps} from "./EvButton.ts";
import {computed, useAttrs, useSlots} from "vue";
import {EvIcon} from "@/components/EvIcon";
import {EvProgressCircular} from "@/components/EvProgressCircular";
import {appearanceModifier, InputSize, sizeModifier} from "@/util";
import {hasSlotWithContent} from "@/composables/hasSlotWithContent.ts";
import {RouterLinkOrHrefProps, useRouterLinkOrHref} from "@/composables/router.ts";


const props = defineProps(makeEvButtonProps());
const attrs = useAttrs();
const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);
const hasIcon = computed(() => (!!props.icon && props.icon !== true));

const isDisabled = computed(() => {
    // we'll add groups later
    return props.disabled;
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
}

</script>
<template>
    <component
        :is="getComponentElement()"
        :href="link.href.value"
        class="ev-button"
        :class="[
            appearanceModifier(props.appearance),
            sizeModifier(props.size, [InputSize.default]),
            {
                'is-icon': isIconLike,
                'is-fullwidth': props.fullWidth,
                'is-loading': props.loading,
                'is-disabled': props.disabled,
                'is-rounded': props.rounded
            }
        ]"
        tabindex="0"
        :disabled="!isLink() ? disabled : null"
        @click="onClick"
    >
        <span class="ev-button--icon-start" v-if="props.iconStart">
            <ev-icon :glyph="props.iconStart" />
        </span>
        <span class="ev-button--prefix" v-if="slots.prefix">
            <slot name="prefix" />
        </span>
        <span class="ev-button--icon" v-if="hasIcon">
             <ev-icon :glyph="props.icon" />
        </span>
        <span class="ev-button--text" v-if="props.text || hasDefaultSlot" data-no-activator>
            <slot>{{ props.text }}</slot>
        </span>
        <span class="ev-button--suffix" v-if="slots.suffix">
            <slot name="suffix" />
        </span>
        <span class="ev-button--icon-end" v-if="props.iconEnd">
            <ev-icon :glyph="props.iconEnd" />
        </span>
        <span class="ev-button--loading">
            <ev-progress-circular indeterminate v-if="props.loading" />
        </span>
    </component>
</template>