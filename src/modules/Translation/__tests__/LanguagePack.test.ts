/**
 * # Language Pack Tests
 */
import {expect, test} from "@jest/globals";
import {LanguagePack} from "@/modules/Translation/LanguagePack.ts";
import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";

const dictionary = {
    greeting: "Hello { name }",
    placement: {
        "one": "{ value }st",
        "two": "{ value }nd",
        "few": "{ value }rd",
        "other": "{ value }th"
    }
};


test('LanguagePack.getTranslatable()', () => {

    const code = new TranslationCode('en');
    const pack = new LanguagePack(code, dictionary);

    const greeting = pack.getTranslatable('greeting');
    expect(greeting?.defaultText).toBe('Hello { name }');

    const placement = pack.getTranslatable('placement');
    expect(placement?.data).toMatchObject({
        "one": "{ value }st",
        "two": "{ value }nd",
        "few": "{ value }rd",
        "other": "{ value }th"
    });

    const nonExistent = pack.getTranslatable('__nonExistent', dictionary);
    expect(nonExistent).toBe(null);

});