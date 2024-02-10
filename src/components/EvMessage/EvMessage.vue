<script setup lang="ts">
/**
 * # EvMessage
 *
 * `<ev-message />`
 */
import './EvMessage.scss';
import {appearanceModifier} from "@/util";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel, ChevronDown} from "@/icons";
import {computed, shallowRef} from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {appearanceIcon, IconValue} from "@/composables/icons.ts";
import {makeEvMessageProps} from "./EvMessage.ts";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {EvButtonProps} from "@/components";

const props = defineProps(makeEvMessageProps());
const modelProxy = useModelProxy(props, 'modelValue');
const isExpanded = shallowRef(false);
const { t } = useLocaleFunctions();

// Emit
const emit = defineEmits([
    'click:dismiss',
    'click:expand',
    'update:modelValue'
]);

/**
 * ## Icon Glyph
 */
const iconGlyph = computed(() => {
    if (props.icon) {
        return props.icon;
    }
    return appearanceIcon(props.appearance);
});

/**
 * ## On Click Dismiss
 */
function dismiss(): void {
    modelProxy.value = false;
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
            appearance: 'link'
        };
        values.push(Object.assign(actionDefaults, action));
    }
    return values;
});

</script>
<template>
    <component
        v-if="modelProxy"
        :is="props.tag"
        :class="[
            'ev-message',
            {
                'is-transparent': props.transparent
            },
            appearanceModifier(props.appearance),
            props.class
        ]"
    >
        <div class="ev-message--icon">
            <slot name="icon">
                <ev-icon :appearance="props.appearance" :glyph="iconGlyph" />
            </slot>
        </div>
        <div class="ev-message--content">
            <h2 class="ev-message--title">{{ props.title }}</h2>
            <transition name="transition-fade">
                <div class="ev-message--expandable" v-if="!props.expandable || isExpanded">
                    <div class="ev-message--description">
                        <slot />
                    </div>
                    <div class="ev-message--actions">
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
        <div class="ev-message--dismiss" v-if="props.dismissible">
            <ev-button rounded
                       :aria-label="t('dismiss')"
                       :icon="Cancel"
                       size="small"
                       appearance="subtle"
                       @click="dismiss"
            />
        </div>
    </component>
</template>