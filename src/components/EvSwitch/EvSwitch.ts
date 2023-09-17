import {propsFactory} from "@/util";
import {makeEvCheckboxProps} from "@/components";


export const makeEvSwitchProps = propsFactory({
    ...makeEvCheckboxProps()
}, 'EvSwitch');