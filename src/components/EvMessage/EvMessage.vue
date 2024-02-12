<script setup lang="ts">
/**
 * # EvMessage
 *
 * `<ev-message />`
 */
import './EvMessage.scss';
import {appearanceModifier, isNumber, makeClassName} from "@/util";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel, ChevronDown} from "@/icons";
import {computed, nextTick, shallowRef, useSlots} from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {appearanceIcon} from "@/composables/icons.ts";
import {makeEvMessageProps} from "./EvMessage.ts";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {EvButtonProps} from "@/components";
import {hasSlotWithContent} from "@/composables/hasSlotWithContent.ts";

const props = defineProps(makeEvMessageProps());
const slots = useSlots();
const hasDefaultSlot = hasSlotWithContent(slots, 'default');
const hasActionSlot = hasSlotWithContent(slots, 'action');
const modelProxy = useModelProxy(props, 'modelValue');
const isExpanded = shallowRef(false);
const { t } = useLocaleFunctions();

// Emit
const emit = defineEmits([
    'dismissed',
    'click:dismiss',
    'click:expand',
    'update:modelValue'
]);

/**
 * ## Icon Glyph
 */
const iconGlyph = computed(() => {
    return (props.icon) ? props.icon : appearanceIcon(props.appearance);
});

const showExpandable = computed(() => {
    return (
        (hasDefaultSlot.value || !!props.description || hasActionSlot.value || !!actions.value.length)
        && (!props.expandable || isExpanded.value)
    );
});

const variantModifier = computed(() => {
    return makeClassName(props.variant, 'is-variant');
});

/**
 * ## On Click Dismiss
 */
function dismiss(): void {
    if (!props.dismissDelay) {
        modelProxy.value = false;
    } else if (isNumber(props.dismissDelay)) {
        const delay = props.dismissDelay;
        setTimeout(() => {
            modelProxy.value = false;
            emit('dismissed');
        }, delay);
    }
    emit('click:dismiss');
}

/**
 * ## On Click Expand
 */
function expand(): void {
    isExpanded.value = !isExpanded.value;
    emit('click:expand', isExpanded.value);
}

/**
 * # Actions
 */
const actions = computed(() => {
    if (!props.actions) {
        return [];
    }
    const values = [];
    for (const action of props.actions) {
        const actionDefaults: EvButtonProps = {
            appearance: 'link',
            size: 'x-small'
        };
        values.push(Object.assign(actionDefaults, action));
    }
    return values;
});

/**
 * # onEnter
 * @param el
 */
function onEnter(el: Element) {
    nextTick(() => {
        const element = el as HTMLElement;
        element.style.height = 'auto';
        const height = getComputedStyle(element).height;
        element.style.height = '0px';
        requestAnimationFrame(() => {
            element.style.height = height;
        });
    });
}

/**
 * # onAfterEnter
 * @param el
 */
function onAfterEnter(el: Element) {
    const element = el as HTMLElement;
    element.style.height = 'auto';
}

/**
 * # onLeave
 * @param el
 */
function onLeave(el: Element) {
    nextTick(() => {
        const element = el as HTMLElement;
        element.style.height = getComputedStyle(element).height;
        requestAnimationFrame(() => {
            element.style.height = '0px';
        });
    });
}

</script>
<template>
    <component
        :is="props.tag"
        v-show="modelProxy"
        :class="[
            'ev-message',
            variantModifier,
            appearanceModifier(props.appearance),
            props.class
        ]"
    >
        <div class="ev-message--icon">
            <slot name="icon">
                <ev-icon :glyph="iconGlyph" />
            </slot>
        </div>
        <div class="ev-message--content">
            <h2 class="ev-message--title">{{ props.title }}</h2>
            <transition
                name="transition-message"
                @before-enter="onEnter"
                @after-enter="onAfterEnter"
                @leave="onLeave"
            >
                <div class="ev-message--expandable" v-if="showExpandable">
                    <div class="ev-message--description"
                         v-if="hasDefaultSlot">
                        <slot name="default" />
                    </div>
                    <div class="ev-message--description"
                         v-else-if="!!props.description"
                         v-html="props.description"></div>
                    <div class="ev-message--actions" v-if="hasActionSlot || actions.length">
                        <slot name="actions">
                            <ev-button
                                v-for="action in actions"
                                v-bind="action" />
                        </slot>
                    </div>
                </div>
            </transition>
        </div>
        <div class="ev-message--expand" v-if="props.expandable">
            <ev-button rounded
                       :class="[
                           { 'is-expanded': isExpanded }
                       ]"
                       :aria-label="t('expand')"
                       :icon="ChevronDown"
                       size="small"
                       appearance="subtle"
                       @click="expand"
            />
        </div>
        <transition name="transition-fade">
            <div class="ev-message--dismiss" v-if="props.dismissible">
                <ev-button rounded
                           :aria-label="t('dismiss')"
                           :icon="Cancel"
                           size="small"
                           appearance="subtle"
                           @click="dismiss"
                />
            </div>
        </transition>
    </component>
</template>