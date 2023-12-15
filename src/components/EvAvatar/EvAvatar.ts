import {makeAppearanceProps, propsFactory} from "@/util";
import {makeComponentProps} from "@/composables/component.ts";
import {IconValue} from "@/composables/icons.ts";

export const makeEvAvatarProps = propsFactory({

    icon: IconValue,
    image: String,
    text: String,

    ...makeComponentProps(),
    ...makeAppearanceProps()

}, 'EvAvatar');