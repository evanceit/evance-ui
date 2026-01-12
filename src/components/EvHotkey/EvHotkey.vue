<script setup lang="ts">
import "./EvHotkey.scss";
import {
    DisplayMode,
    KeyMapConfig,
    makeEvHotkeyProps,
    PlatformKeyConfig,
} from "./EvHotkey";
import { computed } from "vue";
import {
    splitKeyCombination,
    splitKeySequence,
} from "@/composables/hotkey/hotkey-parsing";
import { useLocaleFunctions } from "@/composables";
import { EvIcon } from "@/components/EvIcon";
import { EvKbd, KbdVariant } from "@/components/EvKbd";
import { variantModifier } from "@/util";

const props = defineProps({ ...makeEvHotkeyProps() });
const { t } = useLocaleFunctions();
const isMac = computed(() => {
    return props.platform === "auto"
        ? typeof navigator !== "undefined" &&
              /macintosh/i.test(navigator.userAgent)
        : props.platform === "mac";
});

const AND_DELINEATOR = Symbol("EvHotkey:AND_DELINEATOR"); // For + separators
const SLASH_DELINEATOR = Symbol("EvHotkey:SLASH_DELINEATOR"); // For / separators
const THEN_DELINEATOR = Symbol("EvHotkey:THEN_DELINEATOR"); // For - separators
const keyCombinations = computed(() => {
    if (!props.keys) {
        return [];
    }
    // Split by spaces to handle multiple key combinations
    // Example: "ctrl+k cmd+p" -> ["ctrl+k", "cmd+p"]
    const combinations = props.keys.split(" ");
    return combinations.map((combination) => {
        const result = [];
        const sequenceGroups = splitKeySequence(combination);
        for (let i = 0; i < sequenceGroups.length; i++) {
            const group = sequenceGroups[i];

            // Add THEN delineator between sequence groups
            if (i > 0) result.push(THEN_DELINEATOR);

            const { keys: keyParts, separators } = splitKeyCombination(group);
            for (let j = 0; j < keyParts.length; j++) {
                const part = keyParts[j];

                // Add AND delineator between keys
                if (j > 0) {
                    result.push(
                        separators[j - 1] === "/"
                            ? SLASH_DELINEATOR
                            : AND_DELINEATOR,
                    );
                }
                result.push(
                    applyDisplayModeToKey(
                        props.keyMap,
                        props.displayMode,
                        part,
                        isMac.value,
                    ),
                );
            }
        }

        return result;
    });
});

function applyDisplayModeToKey(
    keyMap: KeyMapConfig,
    mode: DisplayMode,
    key: string,
    isMac: boolean,
) {
    const lowerKey = key.toLowerCase();
    if (lowerKey in keyMap) {
        const result = processKey(keyMap[lowerKey], mode, isMac);
        if (result.text.startsWith("$")) {
            result.text = t(result.text.replace("$", ""));
        }
        return result;
    }
    return {
        icon: null,
        text: key.toUpperCase(),
    };
}

function processKey(
    config: PlatformKeyConfig,
    requestedMode: DisplayMode,
    isMac: boolean,
) {
    const keyCfg = isMac && config.mac ? config.mac : config.default;
    return {
        icon: requestedMode === "icon" ? keyCfg.icon ?? null : null,
        text: keyCfg.text ?? null,
    };
}

function isDivider(key) {
    return (
        key === AND_DELINEATOR ||
        key === SLASH_DELINEATOR ||
        key === THEN_DELINEATOR
    );
}

function getDivider(key) {
    return key === AND_DELINEATOR
        ? "+"
        : key === SLASH_DELINEATOR
          ? "/"
          : t("hotkey.then");
}

const variantClass = computed(() => {
    return variantModifier(props.variant ?? KbdVariant.default, ["default"]);
});

const accessibleLabel = computed(() => {
    if (!props.keys) return "";

    const readableShortcuts = keyCombinations.value.map((combination) => {
        const readableParts: string[] = [];

        for (const key of combination) {
            if (key === AND_DELINEATOR) {
                readableParts.push(t("hotkey.plus"));
            } else if (key === SLASH_DELINEATOR) {
                readableParts.push(t("hotkey.or"));
            } else if (key === THEN_DELINEATOR) {
                readableParts.push(t("hotkey.then"));
            } else {
                readableParts.push(key.text);
            }
        }
        return readableParts.join(" ");
    });

    const shortcutText = readableShortcuts.join(", ");
    return t("hotkey.shortcut", { value: shortcutText });
});

</script>

<template>
    <div
        role="img"
        :aria-label="accessibleLabel"
        :class="['ev-hotkey', variantClass, props.class]"
        :style="props.style">
        <template
            v-for="(combination, combinationIndex) in keyCombinations"
            :key="combinationIndex">
            <span class="ev-hotkey-combination">
                <template
                    v-for="(key, keyIndex) in combination"
                    :key="keyIndex">
                    <span
                        v-if="isDivider(key)"
                        class="ev-hotkey-divider"
                        aria-hidden="true">
                        {{ getDivider(key) }}
                    </span>
                    <ev-kbd
                        v-else
                        class="ev-hotkey-key"
                        :variant="props.variant"
                        aria-hidden="true"
                        :title="key.text">
                        <ev-icon v-if="key.icon" :glyph="key.icon" />
                        <template v-else>
                            {{ key.text }}
                        </template>
                    </ev-kbd>
                </template>
            </span>
        </template>
    </div>
</template>
