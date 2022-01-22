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
const axios_1 = __importDefault(require("axios"));
const socket_io_client_1 = require("socket.io-client");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const manager = new socket_io_client_1.Manager('ws://localhost:3001', {
        reconnectionDelayMax: 10000,
    });
    const socket = manager.socket('/');
    socket.on('connect', () => {
        socket.on('request', (msg) => {
            const req = msg.message;
            console.log(req);
            setTimeout(() => socket.emit('response', {
                id: req.id,
                data: {
                    status: 200,
                    contentType: 'text/plain',
                    body: 'example'
                }
            }), 1000);
        });
    });
    setInterval(() => axios_1.default.post('http://localhost:3000/test', {
        value: 'example'
    }), 2000);
}))();
//# sourceMappingURL=start.js.map