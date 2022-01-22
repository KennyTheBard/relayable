"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const http_1 = __importDefault(require("http"));
const middleware_1 = require("./middleware");
const socket_manager_1 = require("./socket/socket-manager");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const httpServer = new http_1.default.Server(app);
    const socketServer = new socket_manager_1.SocketManager(httpServer);
    // add middleware
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use(new middleware_1.ErrorHandlerMiddleware().use);
    const router = (0, express_1.Router)();
    router.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.url);
        yield socketServer.sendRequest(req, (data) => {
            res.status(data.status)
                .contentType(data.contentType)
                .send(data.body);
        });
    }));
    app.use('/', router);
    app.listen(3000, () => {
        console.log(`Server starting on port 3000`);
    });
}))();
//# sourceMappingURL=start.js.map