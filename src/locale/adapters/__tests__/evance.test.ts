import {test} from "@jest/globals";

import {
    translate
} from "@/locale/adapters/evance.ts";

import {LanguagePack} from "@/modules/Translation/LanguagePack.ts";
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

    const translator = new Translator('en');
    translator.addLanguagePack(new LanguagePack('en',  dictionary));

    const translation = translator.translate('placement', {
        value: 2,
        ordinal: true
    });

    console.log(translation);

    const translation2 = translator.translate('foo', {
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