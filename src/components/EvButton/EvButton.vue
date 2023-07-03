<script setup lang="ts">
/**
 * # EvButton
 */
import './EvButton.scss';
import EvIcon from "../EvIcon/EvIcon.vue";
import {useSlots} from "vue";

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
    href?: string,
    icon?: Object,
    iconAfter?: Object,
    iconBefore?: Object
    size?: Size,
    fullWidth?: boolean,
    loading?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
    appearance: 'default',
    fullWidth: false,
    loading: false
});

const slots = useSlots();

/**
 * ## Get Component Element
 *
 * An `<ev-button>` may render as:
 * - `<a>` when an `href` is supplied
 * - `<button>` when `href` is NOT supplied, or is an empty string
 */
const getComponentElement = () => {
    return isLink() ? 'a' : 'button';
}

/**
 * ## Is Link?
 * Returns `true` if an `href` was supplied AND is NOT an empty string.
 */
const isLink = () => {
    return (props.href && props.href.length > 0);
};

/**
 * ## Get Appearance Class
 */
const getAppearanceClass = () => {
    return props.appearance ? `appearance-${props.appearance}` : 'appearance-default';
};

/**
 * ## Get Size Class
 */
const getSizeClass = () => {
    return props.size && props.size !== 'medium' ? `size-${props.size}` : null;
};

/**
 * Has Default Slot?
 */
function hasDefaultSlot() {
    const defaultSlot = (slots.default) ? slots.default() : null;
    if (!defaultSlot) {
        return false;
    }
    return (defaultSlot.length > 0 && !!defaultSlot[0].children);
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
        && !hasDefaultSlot()
        && !props.fullWidth;
}

</script>
<template>
    <component
        :is="getComponentElement()"
        :href="isLink() ? href : null"
        class="ev-button"
        :class="[
            getAppearanceClass(),
            getSizeClass(),
            {
                'is-icon': isIconOnly(),
                'is-fullwidth': props.fullWidth,
                'is-loading': props.loading
            }
        ]"
        tabindex="0"
    >
        <span class="ev-button--prefix" v-if="icon || iconBefore">
            <ev-icon :glyph="icon ? icon : iconBefore" />
        </span>
        <span class="ev-button--text" v-if="hasDefaultSlot()">
            <slot />
        </span>
        <span class="ev-button--suffix" v-if="iconAfter">
            <ev-icon :glyph="iconAfter" />
        </span>
    </component>
</template>