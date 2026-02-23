import { propsFactory } from "@/util";
import { PropType } from "vue";
import { TranslationVariables } from "@/modules/Translation/Translator";

type TranslationTemplatePart =
    | { type: "text"; value: string }
    | { type: "slot"; name: string };

/**
 * Split a translation string into parts:
 *
 * "Press {hotkey} to submit"
 * =>
 * [
 *   { type: "text", value: "Press " },
 *   { type: "slot", name: "hotkey" },
 *   { type: "text", value: " to submit" }
 * ]
 */
export function parseTranslationTemplate(template: string) {
    const regex = /\{\s*(\w+)\s*}/g;
    const results: TranslationTemplatePart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray;
    while ((match = regex.exec(template)) !== null) {
        if (match.index > lastIndex) {
            results.push({
                type: "text",
                value: template.slice(lastIndex, match.index),
            });
        }
        results.push({
            type: "slot",
            name: match[1]?.trim() ?? "",
        });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < template.length) {
        results.push({
            type: "text",
            value: template.slice(lastIndex),
        });
    }
    return results;
}

export const makeEvTProps = propsFactory(
    {
        keypath: String,
        variables: Object as PropType<TranslationVariables>,
    },
    "EvT",
);