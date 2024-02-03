import {expect, test} from "@jest/globals";
import {Translator} from "@/modules/Translation/Translator.ts";
import {shallowRef} from "vue";


const dictionary = {
    greeting: "Hello { name }",
    placement: {
        "one": "{ value }st",
        "two": "{ value }nd",
        "few": "{ value }rd",
        "other": "{ value }th"
    },
    months: {
        "one": "{ value } month",
        "other": "{ value } months"
    }
};

const frenchDictionary = {
    greeting: "Bonjour { name }"
}

test('Translator.translate()', () => {

    const defaultLocale = shallowRef('en');
    const currentLocale = shallowRef('en');

    const translator = new Translator(defaultLocale, currentLocale);
    translator.addLanguagePack('en',  dictionary);
    translator.addLanguagePack('fr',  frenchDictionary);

    // Greeting
    let greeting = translator.translate('greeting', {
        name: 'Kitty'
    });
    expect(greeting).toBe('Hello Kitty');

    // Change current locale
    translator.setCurrentLocale('fr');

    // Now ensure that the one french terms works, whilst others fallback to the 'en' locale.
    let bonjour = translator.translate('greeting', {
        name: 'Kitty'
    });
    expect(bonjour).toBe('Bonjour Kitty');

    // Ensure we can still access the 'en' translations
    greeting = translator.translate('greeting', {
        name: 'Kitty'
    }, 'en');
    expect(greeting).toBe('Hello Kitty');

    // Cardinal Test
    let months = translator.translate('months', {
        value: 1
    });
    expect(months).toBe('1 month');
    const zeroMonths = translator.translate('months', {
        value: 0
    });
    expect(zeroMonths).toBe('0 months');

    // Ordinal Test
    const placement = translator.translate('placement', {
        value: 2,
        ordinal: true
    });
    expect(placement).toBe('2nd');

    // Test non-existent lookup
    const nonExistent = translator.translate('__nonExistent');
    expect(nonExistent).toBe('__nonExistent');

});