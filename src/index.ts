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

export * from "./components";
export * from "./directives";
export * from "./services";
export * from "./icons";
