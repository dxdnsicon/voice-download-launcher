"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const task_config_1 = require("../config/task-config");
class Result {
    constructor() {
        this.rootName = '';
        this.rootName = task_config_1.TASK_HISTORY_PATH;
        fs_1.default.exists(task_config_1.CACHE_DIR, async (exists) => {
            if (!exists) {
                fs_1.default.mkdirSync(task_config_1.CACHE_DIR);
            }
        });
    }
    async getResult() {
        return new Promise(resolve => {
            try {
                fs_1.default.exists(this.rootName, async (exists) => {
                    if (!exists) {
                        fs_1.default.writeFileSync(this.rootName, JSON.stringify({}));
                    }
                });
                const data = fs_1.default.readFileSync(this.rootName, 'utf-8');
                resolve(data);
            }
            catch (e) {
                resolve('');
            }
        });
    }
    async setResult(map) {
        if (!map)
            return;
        console.log(this.rootName);
        fs_1.default.writeFileSync(this.rootName, JSON.stringify(map));
    }
}
exports.default = Result;
//# sourceMappingURL=result.js.map