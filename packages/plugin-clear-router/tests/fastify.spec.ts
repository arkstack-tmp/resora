import { Resource, registerPlugin, resetPluginsForTests } from 'resora'
import { beforeEach, describe, expect, it } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'

import { Router as ClearRouter } from 'clear-router/fastify'
import { Controller } from 'clear-router'
import { clearRouterFastifyPlugin } from '../src'

describe('@resora/plugin-clear-router fastify', () => {
    let app: FastifyInstance

    beforeEach(() => {
        resetPluginsForTests()
        registerPlugin(clearRouterFastifyPlugin)

        ClearRouter.routes = []
        ClearRouter.prefix = ''
        ClearRouter.groupMiddlewares = []
        ClearRouter.globalMiddlewares = []
        ClearRouter.routesByPathMethod = {}
        ClearRouter.routesByMethod = {}

        app = fastify()
    })

    const setup = async () => {
        ClearRouter.apply(app)
        await app.ready()
    }

    it('dispatches bare resora resources returned from inline handlers', async () => {
        ClearRouter.get('/users/1', () => {
            return new Resource({ id: 1, name: 'Ada' })
        })

        await setup()

        const response = await app.inject({ method: 'GET', url: '/users/1' })

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({
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

        await setup()

        const response = await app.inject({ method: 'GET', url: '/users/2' })

        expect(response.statusCode).toBe(202)
        expect(response.headers['x-plugin']).toBe('1')
        expect(response.json()).toEqual({
            data: {
                id: 2,
                name: 'Grace',
            },
        })
    })
})
