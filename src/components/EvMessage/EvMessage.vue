<script setup lang="ts">
/**
 * # EvMessage
 *
 * `<ev-message />`
 */
import './EvMessage.scss';
import {Appearance, appearanceModifier} from "@/util";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel, ChevronDown} from "@/icons";
import {computed, shallowRef} from "vue";
import EvButton from "@/components/EvButton/EvButton.vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {appearanceIcon} from "@/composables/icons.ts";
import {makeEvMessageProps} from "./EvMessage.ts";
import {useLocaleFunctions} from "@/composables/locale.ts";
import {EvTransition} from "@/components/EvTransition";

const props = defineProps(makeEvMessageProps());
const { t } = useLocaleFunctions();

// Emit
const emit = defineEmits([
    'click:close',
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

const modelProxy = useModelProxy(props, 'modelValue');

const isExpanded = shallowRef(false);

/**
 * ## On Click Close
 * @param e
 */
function close(e: Event): void {
    modelProxy.value = false;
    emit('click:close', e);
}

/**
 * ## On Click Expand
 * @param e
 */
function expand(e: Event): void {
    isExpanded.value = !isExpanded.value;
}

</script>
<template>
    <component
        v-if="modelProxy"
        :is="props.tag"
        :class="[
            'ev-message',
            appearanceModifier(props.appearance, [Appearance.default]),
            props.class
        ]"
    >
        <div class="ev-message--icon">
            <ev-icon :appearance="props.appearance" :glyph="iconGlyph" />
        </div>
        <div class="ev-message--content">
            <h2 class="ev-message--title">{{ props.title }}</h2>
            <transition name="transition-fade">
                <div v-if="!props.expandable || isExpanded">
                    <div class="ev-message--description">
                        <slot />
                    </div>
                    <div class="ev-message--actions"></div>
                </div>
            </transition>
        </div>
        <div class="ev-message--expand" v-if="props.expandable">
            <ev-button rounded
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
                       @click="close"
            />
        </div>
    </component>
</template>