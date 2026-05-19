import { Resource, registerPlugin, resetPluginsForTests } from 'resora'
import { beforeEach, describe, expect, it } from 'vitest'
import express, { Router as ExpressRouter } from 'express'

import { Router as ClearRouter } from 'clear-router/express'
import { Controller } from 'clear-router'
import { clearRouterExpressPlugin } from '../src'
import request from 'parasito'

describe('@resora/plugin-clear-router express', () => {
    let app: express.Application
    let router: ExpressRouter

    beforeEach(() => {
        resetPluginsForTests()
        registerPlugin(clearRouterExpressPlugin)

        ClearRouter.reset()

        app = express()
        router = ExpressRouter()
        app.use(express.json())
    })

    const setup = async () => {
        await ClearRouter.apply(router)
        app.use(router)
    }

    it('dispatches bare resora resources returned from inline handlers', async () => {
        ClearRouter.get('/users/1', () => {
            return new Resource({ id: 1, name: 'Ada' })
        })

        await setup()

        const response = await request(app).get('/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            data: {
                id: 1,
                name: 'Ada',
            },
        })
    })

    it('dispatches resources returned from controller actions', async () => {
        class UserController extends Controller {
            index () {
                return new Resource({ id: 3, name: 'Linus' })
            }
        }

        ClearRouter.get('/users', [UserController, 'index'])

        await setup()

        const response = await request(app).get('/users')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            data: {
                id: 3,
                name: 'Linus',
            },
        })
    })

    it('preserves resora withResponse header and status mutations', async () => {
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

        const response = await request(app).get('/users/2')

        expect(response.status).toBe(202)
        expect(response.header['x-plugin']).toBe('1')
        expect(response.body).toEqual({
            data: {
                id: 2,
                name: 'Grace',
            },
        })
    })

    it('does not double-send async controller responses bound with .response()', async () => {
        class UserController extends Controller {
            async index () {
                return new Resource({ id: 4, name: 'Katherine' })
                    .additional({ message: 'OK' })
                    .response()
                    .setStatusCode(202)
            }
        }

        ClearRouter.get('/async-users', [UserController, 'index'])

        await setup()

        const response = await request(app).get('/async-users')

        expect(response.status).toBe(202)
        expect(response.body).toEqual({
            data: {
                id: 4,
                name: 'Katherine',
            },
            message: 'OK',
        })
    })
})
