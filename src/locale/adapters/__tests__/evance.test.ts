import {test} from "@jest/globals";

import {
    translate
} from "@/locale/adapters/evance.ts";

import {LanguagePack} from "@/modules/Translation/LanguagePack.ts";
import {LocaleCode} from "@/modules/Locale/LocaleCode.ts";
import {Translator} from "@/modules/Translation/Translator.ts";


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

    /*
    const locale = new TranslationCode('en');
    const languagePack = new LanguagePack(locale, dictionary);

    const translation = translate('placement', {
        value: 4,
        ordinal: true
    }, languagePack);
    console.log(translation);

     */
    const localeCode = new LocaleCode('en');
    const translator = new Translator(localeCode);
    const languagePack = new LanguagePack(
        localeCode,
        dictionary
    );
    translator.addLanguagePack(languagePack);

    const translation = translator.translate(localeCode, 'placement', {
        value: 2,
        ordinal: true
    });

    console.log(translation);

    const translation2 = translator.translate(localeCode, 'foo', {
        value: 2,
        ordinal: true
    });

    console.log(translation2);

    // @todo: <--- YOU ARE HERE
    /*
        Allow translator to accept strings for locale codes
        in addition to locale objects.

        Allow language packs to accept strings for translation codes
        in addition to translation code objects.

        Allow translator translate to accept strings for localeCode
     */

});