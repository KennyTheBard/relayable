"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
const await_lock_1 = __importDefault(require("await-lock"));
const uuid_1 = require("uuid");
class SocketManager {
    constructor(httpServer) {
        this.relaySocketLock = new await_lock_1.default();
        this.onResponseFnMap = new Map();
        this.relaySocket = null;
        this.server = new socket_io_1.Server(httpServer);
        this.server.on('connect', (localSocket) => __awaiter(this, void 0, void 0, function* () {
            yield this.onConnect(localSocket);
            localSocket.on('response', (msg) => {
                console.log(msg);
                const fn = this.onResponseFnMap.get(msg.id);
                if (!fn) {
                    console.error('No response function registered');
                    return;
                }
                fn(msg.data);
            });
            localSocket.on('disconnect', () => {
                this.onDisconnect(localSocket);
            });
        }));
        this.server.listen(3001);
    }
    sendRequest(request, onResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.relaySocketLock.acquireAsync();
            try {
                if (!this.relaySocket) {
                    return false;
                }
                const id = (0, uuid_1.v4)();
                this.onResponseFnMap.set(id, onResponse);
                return this.relaySocket.emit('request', {
                    message: this.serilizeRequest(id, request),
                    id: this.relaySocket.id
                });
            }
            finally {
                this.relaySocketLock.release();
            }
        });
    }
    onConnect(localSocket) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.relaySocketLock.acquireAsync();
            try {
                if (this.relaySocket) {
                    localSocket.disconnect();
                    return;
                }
                this.relaySocket = localSocket;
            }
            finally {
                this.relaySocketLock.release();
            }
        });
    }
    onDisconnect(localSocket) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.relaySocketLock.acquireAsync();
            try {
                if (this.relaySocket === localSocket) {
                    this.relaySocket = null;
                }
            }
            finally {
                this.relaySocketLock.release();
            }
        });
    }
    serilizeRequest(id, request) {
        return {
            id,
            request: {
                url: request.url,
                params: request.params,
                query: request.query,
                headers: request.headers,
                body: request.body
            }
        };
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socket-manager.js.map