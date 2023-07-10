<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import EvIcon from "../EvIcon/EvIcon.vue";
import {useSlots} from "vue";
import EvProgressCircular from "../EvProgressCircular/EvProgressCircular.vue";
import {appearanceModifier, sizeModifier} from "../../util";
import {hasSlotWithContent} from "../../composables/hasSlotWithContent.ts";

/**
 * ## Button Appearance
 */
type Appearance = 'default'
    | 'danger'
    | 'primary'
    | 'subtle';

/**
 * ## Button Size
 */
type Size = 'small'
    | 'medium'
    | 'large';

/**
 * ## Button Props
 */
interface ButtonProps {
    appearance?: Appearance,
    disabled?: boolean,
    href?: string,
    icon?: Object,
    iconAfter?: Object,
    iconBefore?: Object
    rounded?: boolean,
    size?: Size,
    fullWidth?: boolean,
    loading?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
    appearance: 'default',
    disabled: false,
    fullWidth: false,
    loading: false,
    rounded: false
});

const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');

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
    return (props.href && props.href.length > 0);
}

</script>
<template>
    <component
        :is="getComponentElement()"
        :href="isLink() ? href : null"
        class="ev-button"
        :class="[
            appearanceModifier(props.appearance),
            sizeModifier(props.size, ['medium']),
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
    >
        <span class="ev-button--prefix" v-if="icon || iconBefore">
            <ev-icon :glyph="icon ? icon : iconBefore" />
        </span>
        <span class="ev-button--text" v-if="hasDefaultSlot">
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