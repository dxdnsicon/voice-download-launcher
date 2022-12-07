"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = void 0;
const net_1 = __importDefault(require("net"));
const getPort = () => {
    const srv = net_1.default.createServer((sock) => sock.end('I need a port'));
    return new Promise((resolve, reject) => {
        srv.listen(0, () => {
            const port = srv.address().port;
            srv.close((err) => {
                if (err)
                    return reject(err);
                resolve(port);
            });
        });
    });
};
exports.getPort = getPort;
//# sourceMappingURL=utils.js.map