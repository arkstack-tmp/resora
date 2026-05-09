# @resora/plugin-clear-router

Bridge plugins for integrating `resora` resources with `clear-router` handlers and controllers without modifying either package.

## Why

`resora` resources are thenables, while `clear-router` automatically resolves and serializes values returned from route handlers and controller actions.

These plugins bind the active `clear-router` request context to Resora before your handler executes, allowing resources to work seamlessly when returned directly from routes or controllers.

Without the plugin, returning resources may not have access to the active request lifecycle or response context.

## Installation

```bash [pnpm]
pnpm add resora @resora/plugin-clear-router
```

OR

```bash [npm]
npm install resora @resora/plugin-clear-router
```

OR

```bash [yarn]
yarn add resora @resora/plugin-clear-router
```

## Usage

Register the plugin before defining routes.

### Express

```ts
import { registerPlugin } from 'resora';
import { clearRouterExpressPlugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterExpressPlugin);
```

### Fastify

```ts
import { registerPlugin } from 'resora';
import { clearRouterFastifyPlugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterFastifyPlugin);
```

### H3

```ts
import { registerPlugin } from 'resora';
import { clearRouterH3Plugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterH3Plugin);
```

### Hono

```ts
import { registerPlugin } from 'resora';
import { clearRouterHonoPlugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterHonoPlugin);
```

### Koa

```ts
import { registerPlugin } from 'resora';
import { clearRouterKoaPlugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterKoaPlugin);
```

### Generic Runtime

Use the generic plugin when your runtime does not have a dedicated adapter.

```ts
import { registerPlugin } from 'resora';
import { clearRouterPlugin } from '@resora/plugin-clear-router';

registerPlugin(clearRouterPlugin);
```

## Returning Resources from Controllers

Once registered, resources can be returned directly from controller methods.

```ts
import { Router, Controller } from 'clear-router';
import { Resource } from 'resora';

class UserController extends Controller {
  index() {
    return new Resource({
      id: 1,
      name: 'Ada',
    });
  }
}

Router.get('/users', [UserController, 'index']);
```

## Returning Resources from Inline Handlers

Resources also work in direct route callbacks.

```ts
import { Router } from 'clear-router';
import { Resource } from 'resora';

Router.get('/users', () => {
  return new Resource({
    id: 1,
    name: 'Ada',
  });
});
```

## Exports

| Export                     | Description                 |
| -------------------------- | --------------------------- |
| `clearRouterExpressPlugin` | Express runtime integration |
| `clearRouterFastifyPlugin` | Fastify runtime integration |
| `clearRouterH3Plugin`      | H3 runtime integration      |
| `clearRouterHonoPlugin`    | Hono runtime integration    |
| `clearRouterKoaPlugin`     | Koa runtime integration     |
| `clearRouterPlugin`        | Generic runtime integration |

## Notes

Plugins are opt-in and do not modify `clear-router` or `resora` globally unless explicitly registered.

Only register the plugin matching the runtime used by your Clear Router application.
