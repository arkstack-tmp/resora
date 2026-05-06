import { Resource, registerPlugin, resetPluginsForTests } from 'resora'
import { beforeEach, describe, expect, it } from 'vitest'

import { Router as ClearRouter } from 'clear-router/hono'
import { Controller } from 'clear-router'
import { Hono } from 'hono'
import { clearRouterHonoPlugin } from '../src'

describe('@resora/plugin-clear-router hono', () => {
    let app: Hono

    beforeEach(() => {
        resetPluginsForTests()
        registerPlugin(clearRouterHonoPlugin)

        ClearRouter.routes = []
        ClearRouter.prefix = ''
        ClearRouter.groupMiddlewares = []
        ClearRouter.globalMiddlewares = []
        ClearRouter.routesByPathMethod = {}
        ClearRouter.routesByMethod = {}

        app = new Hono()
    })

    const setup = () => {
        ClearRouter.apply(app as any)
    }

    it('dispatches bare resora resources returned from inline handlers', async () => {
        ClearRouter.get('/users/1', () => {
            return new Resource({ id: 1, name: 'Ada' })
        })

        setup()

        const response = await app.fetch(new Request('http://localhost/users/1'))

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({
            data: {
                id: 1,
                name: 'Ada',
            },
        })
    })

    it('supports controller actions and preserves withResponse mutations', async () => {
        class CustomResource extends Resource {
            withResponse (response: any) {
                response
                    .header('X-Plugin', '1')
                    .setStatusCode(202)
            }
        }

        class UserController extends Controller {
            show () {
                return new CustomResource({ id: 2, name: 'Grace' })
            }
        }

        ClearRouter.get('/users/2', [UserController, 'show'])

        setup()

        const response = await app.fetch(new Request('http://localhost/users/2'))

        expect(response.status).toBe(202)
        expect(response.headers.get('X-Plugin')).toBe('1')
        expect(await response.json()).toEqual({
            data: {
                id: 2,
                name: 'Grace',
            },
        })
    })
})
