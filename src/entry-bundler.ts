
import './css/core.scss';

import * as components from './components';
import * as directives from './directives';
import * as services from './services';
import { createEvanceUi as _createEvanceUi } from './framework.ts';

import type { EvanceUiOptions } from "./framework.ts";

export const createEvanceUi = (options: EvanceUiOptions = {}) => {
    return _createEvanceUi({ components, directives, services, ...options });
};

export {
    components,
    directives,
    services
};

export * from './composables';