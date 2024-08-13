
# Evance UI
Evance UI is a Vue Component and Icon library, which is a [MIT licensed](http://opensource.org/licenses/MIT) project 
developed and maintained by [Evance](https://www.evance.io) for Evance's core UI and Apps.

We could not have done this project without [Vuetify](https://github.com/vuetifyjs/vuetify), 
which influences this codebase and has been adapted to suit Evance.

## Installation
Evance UI is available as a `npm` package.
```
npm i @evance/evance-ui
```

In the file where you create the Vue application, add the following code:

```ts
import {createApp} from "vue";

import "@evance/evance-ui/styles";
import { createEvanceUi, components, directives, services } from "@evance/evance-ui";

const evanceUi = createEvanceUi({
    components,
    directives,
    services
});
app.use(evanceUi);

app.mount('#app');
```

### Documentation
TODO

### License

Evance UI is available under the [MIT](http://opensource.org/licenses/MIT) software license.