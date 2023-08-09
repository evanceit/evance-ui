import {expect, test} from "@jest/globals";
import {isPluralizationRules} from "@/modules/Translation/Pluralization.ts";

const dictionary = {
    greeting: "Hello { name }",
    placement: {
        "one": "{ value }st",
        "two": "{ value }nd",
        "few": "{ value }rd",
        "other": "{ value }th"
    }
};

test('isPluralizationRules', () => {
    expect(isPluralizationRules(dictionary.greeting)).toBe(false);

    expect(isPluralizationRules(dictionary.placement)).toBe(true);
});