<script setup lang="ts">
/**
 * # EvMessage
 *
 * `<ev-message />`
 */
import "./EvMessage.scss";
import { appearanceModifier, isNumber, makeClassName } from "@/util";
import EvIcon from "../EvIcon/EvIcon.vue";
import { CancelIcon, ChevronDownIcon } from "@/icons";
import { computed, nextTick, shallowRef } from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import { useModelProxy } from "@/composables/modelProxy.ts";
import { appearanceIcon } from "@/composables/icons.ts";
import { makeEvMessageProps } from "./EvMessage.ts";
import { useLocaleFunctions } from "@/composables/locale.ts";
import { EvButtonProps } from "@/components/EvButton";
import { hasSlotWithContent } from "@/composables/hasSlotWithContent.ts";
import { EvButtonGroup, EvHeading } from "@/components";

const props = defineProps({
    ...makeEvMessageProps(),
});
const slots = defineSlots<{
    actions(): never;
    default(): never;
    icon(): never;
}>();
const hasDefaultSlot = hasSlotWithContent(slots, "default");
const hasActionSlot = hasSlotWithContent(slots, "action");
const modelProxy = useModelProxy(props, "modelValue");
const isExpanded = shallowRef(false);
const { t } = useLocaleFunctions();

// Emit
const emit = defineEmits([
    "dismissed",
    "click:dismiss",
    "click:expand",
    "update:modelValue",
]);

/**
 * ## Icon Glyph
 */
const iconGlyph = computed(() => {
    return props.icon ? props.icon : appearanceIcon(props.appearance);
});

const showExpandable = computed(() => {
    return (
        (hasDefaultSlot.value ||
            !!props.description ||
            hasActionSlot.value ||
            !!actions.value.length) &&
        (!props.expandable || isExpanded.value)
    );
});

const variantModifier = computed(() => {
    return makeClassName(props.variant, "is-variant");
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
            emit("dismissed");
        }, delay);
    }
    emit("click:dismiss");
}

/**
 * ## On Click Expand
 */
function expand(): void {
    isExpanded.value = !isExpanded.value;
    emit("click:expand", isExpanded.value);
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
            appearance: props.variant === "bold" ? "inverse" : props.appearance,
            variant: "link",
            size: "x-small",
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
        element.style.height = "auto";
        const height = getComputedStyle(element).height;
        element.style.height = "0px";
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
    element.style.height = "auto";
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
            element.style.height = "0px";
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
            props.class,
        ]">
        <div class="ev-message--icon">
            <slot name="icon">
                <ev-icon :glyph="iconGlyph" />
            </slot>
        </div>
        <div class="ev-message--content">
            <ev-heading
                class="ev-message--title"
                size="small"
                :text="props.title" />
            <transition
                name="transition-message"
                @before-enter="onEnter"
                @after-enter="onAfterEnter"
                @leave="onLeave">
                <div v-if="showExpandable" class="ev-message--expandable">
                    <div v-if="hasDefaultSlot" class="ev-message--description">
                        <slot name="default" />
                    </div>
                    <div
                        v-else-if="!!props.description"
                        class="ev-message--description"
                        v-html="props.description"></div>
                    <div
                        v-if="hasActionSlot || actions.length"
                        class="ev-message--actions">
                        <slot name="actions">
                            <ev-button-group :items="actions" />
                        </slot>
                    </div>
                </div>
            </transition>
        </div>
        <div v-if="props.expandable" class="ev-message--expand">
            <ev-button
                rounded
                :class="[{ 'is-expanded': isExpanded }]"
                :aria-label="t('expand')"
                :icon="ChevronDownIcon"
                size="small"
                variant="subtle"
                @click="expand" />
        </div>
        <transition name="transition-fade">
            <div v-if="props.dismissible" class="ev-message--dismiss">
                <ev-button
                    rounded
                    :aria-label="t('dismiss')"
                    :icon="CancelIcon"
                    size="small"
                    variant="subtle"
                    @click="dismiss" />
            </div>
        </transition>
    </component>
</template>
