import { computed, isRef, Ref, watch } from "vue";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MaskToken = {
    /** RegExp that a character must satisfy to be accepted at this position. */
    pattern: RegExp;
    /** Optional transform applied to an accepted character (e.g. toUpperCase). */
    transform?: (char: string) => string;
    /** Reserved for future use: allow the position to be skipped. */
    optional?: boolean;
};

export type MaskConfig = {
    /** Format string. Token characters mark editable positions; everything else is a literal. */
    format: string;
    /**
     * Character shown for unfilled token positions in eager mode.
     * `null` (default) = lazy mode — no placeholder characters shown.
     */
    placeholder?: string | null;
    /** Override or extend the default token definitions. */
    tokens?: Record<string, MaskToken>;
    /**
     * What `update:modelValue` emits.
     * - `'raw'`    — only the characters the user typed, no literals (default)
     * - `'masked'` — the full formatted string including auto-inserted literals
     */
    emit?: "raw" | "masked";
    /**
     * RegExp or predicate tested against the current raw value.
     * Used to select the active mask when an array of masks is provided.
     * Masks without `match` act as catch-all fallbacks.
     */
    match?: RegExp | ((rawValue: string) => boolean);
};

/** Shorthand: a plain format string uses all defaults. */
export type MaskInput = string | MaskConfig | Array<string | MaskConfig>;

// ─── Default tokens ───────────────────────────────────────────────────────────

export const DEFAULT_TOKENS: Record<string, MaskToken> = {
    "#": { pattern: /\d/ },
    A: { pattern: /[a-zA-Z]/ },
    N: { pattern: /[a-zA-Z0-9]/ },
    X: { pattern: /./ },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalise any MaskInput (including undefined) into a resolved array of MaskConfig objects. */
function normalise(mask: MaskInput | undefined | null): MaskConfig[] {
    if (!mask) return [];
    const items = Array.isArray(mask) ? mask : [mask];
    return items.map((m) => (typeof m === "string" ? { format: m } : m));
}

/**
 * Resolve the token table for a given config, merging defaults with any
 * per-config overrides.
 */
function resolveTokens(config: MaskConfig): Record<string, MaskToken> {
    return { ...DEFAULT_TOKENS, ...(config.tokens ?? {}) };
}

/** Return true if `ch` is a token character in `tokens`. */
function isToken(ch: string, tokens: Record<string, MaskToken>): boolean {
    return ch in tokens;
}

/**
 * Extract only the user-typed characters from a display value, stripping all
 * literals defined by the mask format.
 */
export function extractRaw(display: string, config: MaskConfig): string {
    const tokens = resolveTokens(config);
    const { format } = config;
    let raw = "";
    let fi = 0; // index into format

    for (let di = 0; di < display.length && fi < format.length; ) {
        const fch = format[fi];
        const dch = display[di];
        if (isToken(fch, tokens)) {
            // Accept the display character if it matches the token pattern
            if (tokens[fch].pattern.test(dch)) {
                raw += dch;
                fi++;
                di++;
            } else {
                // Mismatch — stop; the rest is placeholder or garbage
                break;
            }
        } else {
            // Literal — skip it in both format and display (if they match)
            if (dch === fch) {
                di++;
            }
            fi++;
        }
    }

    return raw;
}

/**
 * Build the display string for `raw` input characters against a mask config.
 * If `placeholder` is set, unfilled token positions are shown with that char.
 */
export function formatValue(raw: string, config: MaskConfig): string {
    const tokens = resolveTokens(config);
    const { format, placeholder = null } = config;
    let result = "";
    let ri = 0; // index into raw

    for (let fi = 0; fi < format.length; fi++) {
        const fch = format[fi];

        if (isToken(fch, tokens)) {
            if (ri < raw.length) {
                const token = tokens[fch];
                const ch = raw[ri];
                if (token.pattern.test(ch)) {
                    result += token.transform ? token.transform(ch) : ch;
                }
                // Advance even if rejected — prevents infinite loops on bad input
                ri++;
            } else if (placeholder !== null) {
                result += placeholder;
            } else {
                // Lazy mode: stop here, don't emit trailing literals
                break;
            }
        } else {
            // Literal character
            if (ri < raw.length || placeholder !== null) {
                // Only emit literals when there is content to wrap, or in eager mode
                result += fch;
            } else {
                break;
            }
        }
    }

    return result;
}

/**
 * Given a cursor position in the raw string, return the equivalent cursor
 * position in the formatted display string.
 */
export function mapRawCursorToDisplay(
    rawPos: number,
    config: MaskConfig,
): number {
    const tokens = resolveTokens(config);
    const { format } = config;
    let ri = 0;
    let di = 0;

    for (let fi = 0; fi < format.length; fi++) {
        const fch = format[fi];
        if (isToken(fch, tokens)) {
            if (ri >= rawPos) break;
            ri++;
            di++;
        } else {
            di++;
        }
    }

    return di;
}

/**
 * Given a cursor position in the display string, return the equivalent
 * position in the raw string.
 */
export function mapDisplayCursorToRaw(
    displayPos: number,
    config: MaskConfig,
): number {
    const tokens = resolveTokens(config);
    const { format } = config;
    let ri = 0;
    let di = 0;

    for (let fi = 0; fi < format.length && di < displayPos; fi++) {
        const fch = format[fi];
        if (isToken(fch, tokens)) {
            ri++;
            di++;
        } else {
            di++;
        }
    }

    return ri;
}

/**
 * Count the number of token-accepted characters in `str` up to `length`.
 * Used to determine how many raw characters sit before the cursor in the
 * browser's current (possibly unformatted) input value.
 */
export function countRawCharsUpTo(
    str: string,
    length: number,
    config: MaskConfig,
): number {
    const tokens = resolveTokens(config);
    let count = 0;
    for (let i = 0; i < length && i < str.length; i++) {
        const ch = str[i];
        for (const token of Object.values(tokens)) {
            if (token.pattern.test(ch)) {
                count++;
                break;
            }
        }
    }
    return count;
}

/**
 * Select the active mask from a list.
 * - Masks with a `match` predicate/regex are tested first (in order).
 * - The first match wins.
 * - If nothing matches, the last mask without a `match` is used as a fallback.
 * - If no fallback exists, the last mask in the array is used.
 */
export function selectMask(masks: MaskConfig[], raw: string): MaskConfig {
    // Attempt pattern-matched masks first
    for (const mask of masks) {
        if (mask.match === undefined) continue;
        const matched =
            mask.match instanceof RegExp
                ? mask.match.test(raw)
                : mask.match(raw);
        if (matched) return mask;
    }

    // Fall back to the last mask without a match predicate
    for (let i = masks.length - 1; i >= 0; i--) {
        if (masks[i].match === undefined) return masks[i];
    }

    return masks[masks.length - 1];
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useInputMask(
    mask: MaskInput | undefined | null | Ref<MaskInput | undefined | null>,
    modelValue: Ref<string | null | undefined>,
    emitUpdate: (value: string) => void,
    inputRef: Ref<HTMLInputElement | null>,
) {
    const masks = computed<MaskConfig[]>(() =>
        normalise(isRef(mask) ? mask.value : mask),
    );

    /** The currently active mask, chosen by pattern matching then fallback. */
    const activeMask = computed<MaskConfig | null>(() => {
        if (!masks.value.length) return null;
        return selectMask(masks.value, modelValue.value ?? "");
    });

    /** The formatted string shown in the <input>. */
    const displayValue = computed<string>(() => {
        if (!activeMask.value) return modelValue.value ?? "";
        return formatValue(modelValue.value ?? "", activeMask.value);
    });

    /**
     * After the browser updates the input value, re-format and correct cursor.
     */
    function onInput(e: Event) {
        if (!activeMask.value) return;
        const input = e.target as HTMLInputElement;
        const cursorPos = input.selectionStart ?? 0;

        // Re-select mask using the raw text currently in the input
        const currentRaw = extractRaw(input.value, activeMask.value);

        // Re-select mask based on new raw (handles multi-mask switching)
        const newMask = selectMask(masks.value, currentRaw);
        const formatted = formatValue(currentRaw, newMask);

        // Derive the raw value under the new mask (in case mask switched)
        const newRaw = extractRaw(formatted, newMask);

        // Count how many raw (token-accepted) characters sit before the cursor
        // in the browser's current value. We cannot use mapDisplayCursorToRaw
        // here because input.value may be unformatted or partially formatted.
        const rawCursorPos = countRawCharsUpTo(input.value, cursorPos, activeMask.value);

        // Clamp cursor to the actual number of raw chars accepted by the mask.
        // This handles typing beyond a full mask — excess chars are dropped but
        // the cursor must not overshoot the formatted string.
        const clampedRawCursor = Math.min(rawCursorPos, newRaw.length);

        // Emit raw or masked depending on config
        const emitValue =
            (newMask.emit ?? "raw") === "masked" ? formatted : newRaw;
        emitUpdate(emitValue);

        // Restore cursor after Vue re-renders the :value binding.
        // We also force-set el.value to the formatted string because Vue will
        // skip its DOM patch when the reactive value hasn't changed (e.g. when
        // the mask is full and the extra character is simply dropped).
        requestAnimationFrame(() => {
            const el = inputRef.value;
            if (!el) return;
            if (el.value !== formatted) {
                el.value = formatted;
            }
            const newDisplayCursor = mapRawCursorToDisplay(
                clampedRawCursor,
                newMask,
            );
            el.setSelectionRange(newDisplayCursor, newDisplayCursor);
        });
    }

    /**
     * Handle special keys — primarily Backspace over auto-inserted literals.
     */
    function onKeydown(e: KeyboardEvent) {
        if (!activeMask.value) return;
        if (e.key !== "Backspace" && e.key !== "Delete") return;
        const input = e.target as HTMLInputElement;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        if (start !== end) return; // let browser handle selection deletion

        const currentMask = activeMask.value;
        const tokens = resolveTokens(currentMask);

        if (e.key === "Backspace" && start > 0) {
            const prevChar = currentMask.format[start - 1];
            if (prevChar !== undefined && !isToken(prevChar, tokens)) {
                // Cursor is right after a literal — move it back one more so
                // the user deletes the actual token character before the literal
                e.preventDefault();
                input.setSelectionRange(start - 1, start - 1);
            }
        }

        if (e.key === "Delete" && start < input.value.length) {
            const nextChar = currentMask.format[start];
            if (nextChar !== undefined && !isToken(nextChar, tokens)) {
                // Cursor is right before a literal — nudge forward
                e.preventDefault();
                input.setSelectionRange(start + 1, start + 1);
            }
        }
    }

    /**
     * Handle paste: strip non-token characters, reformat from scratch.
     */
    function onPaste(e: ClipboardEvent) {
        if (!activeMask.value) return;
        e.preventDefault();
        const input = e.target as HTMLInputElement;
        const pasteText = e.clipboardData?.getData("text") ?? "";

        // Combine: text before cursor + pasted content + text after cursor
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const current = input.value;
        const combined = current.slice(0, start) + pasteText + current.slice(end);

        // Extract raw from the combined string — accept any char matched by any token
        const currentMask = activeMask.value;
        const tokens = resolveTokens(currentMask);
        let raw = "";
        for (const ch of combined) {
            for (const token of Object.values(tokens)) {
                if (token.pattern.test(ch)) {
                    raw += ch;
                    break;
                }
            }
        }

        const newMask = selectMask(masks.value, raw);
        const formatted = formatValue(raw, newMask);
        const newRaw = extractRaw(formatted, newMask);

        const emitValue =
            (newMask.emit ?? "raw") === "masked" ? formatted : newRaw;
        emitUpdate(emitValue);

        // Place cursor after pasted content
        requestAnimationFrame(() => {
            const el = inputRef.value;
            if (!el) return;
            const rawCursorPos = Math.min(
                (modelValue.value?.length ?? 0) + pasteText.length,
                newRaw.length,
            );
            const displayCursor = mapRawCursorToDisplay(rawCursorPos, newMask);
            el.setSelectionRange(displayCursor, displayCursor);
        });
    }

    // When modelValue changes externally (e.g. programmatic set), sync display
    watch(
        () => modelValue.value,
        () => {
            const el = inputRef.value;
            if (!el || document.activeElement === el) return;
            // Input is not focused — display will update reactively via displayValue
        },
    );

    return {
        displayValue,
        activeMask,
        onInput,
        onKeydown,
        onPaste,
    };
}
