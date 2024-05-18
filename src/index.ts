import "./css/core.scss";

import * as components from "./components";
import * as directives from "./directives";
import * as services from "./services";
import { createEvanceUi as _createEvanceUi } from "./framework";

import type { EvanceUiOptions } from "./framework";

export const createEvanceUi = (options: EvanceUiOptions = {}) => {
    return _createEvanceUi({ components, directives, services, ...options });
};

export { components, directives, services };

export * from "./composables";


/**
 * I am experimenting with exports to see how they work in a sub-project
 * I need to be able to get individual components to render in @evance/evance-ui/components
 * I would like icons to come from @evance/evance-ui/icons
 */
export { EvButton } from "@/components";
export { CheckIcon } from "@/icons";
