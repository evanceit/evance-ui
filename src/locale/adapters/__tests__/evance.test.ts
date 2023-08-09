import {test} from "@jest/globals";

import {
    translate
} from "@/locale/adapters/evance.ts";

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


test('translate', () => {

    const locale = new TranslationCode('en');
    const languagePack = new LanguagePack(locale, dictionary);

    const translation = translate('placement', {
        value: 4,
        ordinal: true
    }, languagePack);
    console.log(translation);
});