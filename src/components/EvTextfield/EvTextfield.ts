import {
    makeInputAppearanceProps,
    makeInputSizeProps,
    makeTextAlignProps,
    propsFactory,
} from "@/util";
import { IconProp } from "@/composables/icons";
import { makeFormFieldProps } from "@/composables/validation";
import { makeComponentProps } from "@/composables/component";
import { makeLabelProps } from "@/components/EvLabel";
import { PropType } from "vue";

export type AutocompleteToken =
    | "on"
    | "off"

    // Addresses & locality
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level4"
    | "address-level3"
    | "address-level2"
    | "address-level1"
    | "country" // Country code
    | "country-name"
    | "language"
    | "postal-code"
    | "street-address"

    // Credit cards & transactions
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-given-name"
    | "cc-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"

    // Passwords & security
    | "current-password"
    | "new-password"
    | "one-time-code"
    | "password"

    // Contact information
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "email"
    | "family-name"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "impp"
    | "name"
    | "nickname"
    | "organization"
    | "organization-title"
    | "sex"
    | "url"
    | "username"

    // Telephone number
    | "tel"
    | "tel-area-code"
    | "tel-country"
    | "tel-country-code"
    | "tel-extension"
    | "tel-local"
    | "tel-local-prefix"
    | "tel-local-suffix"
    | "tel-national"

    // Groups
    | "billing"
    | "home"
    | "mobile"
    | `section-${string}`
    | "shipping"
    | "work"
    | string;

/**
 * # Make EvTextfield Props
 */
export const makeEvTextfieldProps = propsFactory(
    {
        autocomplete: String as PropType<AutocompleteToken>,
        autofocus: Boolean,
        autoselect: Boolean,
        clearable: Boolean,
        dataFormType: String,
        iconStart: IconProp,
        iconEnd: IconProp,
        loading: Boolean,
        placeholder: String,
        prefix: String,
        role: String,
        rounded: Boolean,
        suffix: String,
        type: {
            type: String,
            default: "text",
        },
        monospace: Boolean,

        ...makeLabelProps(),
        ...makeTextAlignProps(),
        ...makeFormFieldProps(),
        ...makeInputAppearanceProps(),
        ...makeInputSizeProps(),
        ...makeComponentProps(),
    },
    "EvTextfield",
);
