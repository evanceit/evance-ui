<script setup lang="ts">
/**
 * # EvMessage
 *
 * `<ev-message />`
 */
import './EvMessage.scss';
import {Appearance, appearanceModifier, AppearanceProp} from "../../util";
import EvIcon from "../EvIcon/EvIcon.vue";
import {
    Cancel,
    CheckCircle as CheckCircleIcon,
    Danger as DangerIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Note as NoteIcon,
    Warning as WarningIcon
} from "../../icons";
import {computed, ref} from "vue";
import EvButton from "../EvButton/EvButton.vue";
import {useModelProxy} from "../../composables/modelProxy.ts";

interface MessageProps {
    appearance?: AppearanceProp,
    closable?: boolean,
    icon?: object,
    modelValue?: boolean,
    title: string
}
const props = withDefaults(defineProps<MessageProps>(), {
    appearance: 'default',
    closable: false,
    icon: null,
    modelValue: true
});


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
    switch (props.appearance) {
        case Appearance.critical:
            return DangerIcon;
        case Appearance.information:
            return InfoIcon;
        case Appearance.success:
            return CheckCircleIcon;
        case Appearance.notice:
            return NoteIcon;
        case Appearance.warning:
            return WarningIcon;
    }
    return HelpIcon;
});

const modelProxy = useModelProxy(props, 'modelValue');

/**
 * ## On Click Close
 * @param e
 */
function close(e: Event): void {
    emit('click:close', e);
    modelProxy.value = false;
}


</script>
<template>
    <section
        v-if="modelProxy"
        class="ev-message"
        :class="[
            appearanceModifier(props.appearance, [Appearance.default])
        ]"
    >
        <div class="ev-message--icon">
            <ev-icon :appearance="props.appearance" :glyph="iconGlyph" />
        </div>
        <div class="ev-message--content">
            <h2 class="ev-message--title">{{ title }}</h2>
            <slot />
        </div>
        <div class="ev-message--closer" v-if="closable">
            <ev-button rounded
                       :icon-start="Cancel"
                       size="small"
                       appearance="subtle"
                       @click="close"
            />
        </div>
    </section>
</template>