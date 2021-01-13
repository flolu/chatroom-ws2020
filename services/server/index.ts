import {setupHttpServer} from './http-server'
import {setupWebSocketServer} from './websocket-server'

setupWebSocketServer()

/**
 * The entire client to server communication uses
 * web sockets. However for authentication I use
 * a simple HTTP communication
 *
 * That's because it's not possible to set cookies
 * with a web socket connection
 * But cookies are required for secure, persistent
 * user authentication in the web
 */
setupHttpServer()
