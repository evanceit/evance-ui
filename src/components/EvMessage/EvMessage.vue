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
    CheckCircle as CheckCircleIcon,
    Danger as DangerIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Note as NoteIcon,
    Warning as WarningIcon
} from "../../icons";
import {computed} from "vue";

interface MessageProps {
    appearance?: AppearanceProp,
    icon?: object
}
const props = withDefaults(defineProps<MessageProps>(), {
    appearance: 'default',
    icon: null
});

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

</script>
<template>
    <div
        class="ev-message"
        :class="[
            appearanceModifier(props.appearance, [Appearance.default])
        ]"
    >
        <div class="ev-message--icon">
            <ev-icon :appearance="props.appearance" :glyph="iconGlyph" />
        </div>
        <div class="ev-message--content">
            <h2 class="ev-message--title">Title</h2>
            <slot />
        </div>
    </div>
</template>