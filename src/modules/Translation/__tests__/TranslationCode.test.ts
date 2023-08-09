import {expect, test} from "@jest/globals";
import {TranslationCode} from "@/modules/Translation/TranslationCode.ts";


test('TranslationCode::fromString()', () => {
    const enGb = TranslationCode.fromString('en-gb');
    expect(enGb.languageCode).toBe('en');
    expect(enGb.countryCode).toBe('GB');
    expect(enGb.isRegional).toBe(true);

    const en = TranslationCode.fromString('en');
    expect(en.languageCode).toBe('en');
    expect(en.countryCode).toBe(null);
    expect(en.isRegional).toBe(false);
});