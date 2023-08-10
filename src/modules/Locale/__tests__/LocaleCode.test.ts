import {expect, test} from "@jest/globals";
import {LocaleCode} from "@/modules/Locale/LocaleCode.ts";

test('LocaleCode.toTranslationCodes()', () => {
    const localeCode = new LocaleCode('en', 'GB');
    const translationCodes = localeCode.toTranslationCodes();
    expect(translationCodes.length).toBe(2);
});