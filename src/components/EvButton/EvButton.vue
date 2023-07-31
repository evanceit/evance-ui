<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import EvIcon from "../EvIcon/EvIcon.vue";
import {computed, toRaw, useAttrs, useSlots} from "vue";
import EvProgressCircular from "../EvProgressCircular/EvProgressCircular.vue";
import {appearanceModifier, InputSize, sizeModifier} from "../../util";
import {hasSlotWithContent} from "../../composables/hasSlotWithContent.ts";
import {makeEvButtonProps} from "./EvButton.ts";
import {useRouterLinkOrHref} from "../../composables/router.ts";


const props = defineProps(makeEvButtonProps());
const attrs = useAttrs();
const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');
const link = useRouterLinkOrHref(props, attrs);

const isDisabled = computed(() => {
    // we'll add groups later
    return props.disabled;
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
 * ## Is Icon Only?
 * Used to determine whether to apply `is-icon` modifier class.
 * Returns `true` if only one icon is applied, the button is not full-width
 * and no text has been supplied.
 */
function isIconOnly() {
    return (
        ((!!props.icon || !!props.iconBefore) && !props.iconAfter)
        || ((!props.icon && !props.iconBefore) && !!props.iconAfter)
    )
        && !hasDefaultSlot.value
        && !props.fullWidth;
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
                'is-icon': isIconOnly(),
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
        <span class="ev-button--prefix" v-if="icon || iconBefore">
            <ev-icon :glyph="icon ? icon : iconBefore" />
        </span>
        <span class="ev-button--text" v-if="hasDefaultSlot" data-no-activator>
            <slot />
        </span>
        <span class="ev-button--suffix" v-if="iconAfter">
            <ev-icon :glyph="iconAfter" />
        </span>
        <span class="ev-button--loading">
            <ev-progress-circular indeterminate v-if="loading" />
        </span>
    </component>
</template>