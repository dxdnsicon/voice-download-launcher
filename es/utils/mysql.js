"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertConf = exports.queryConf = exports.upsertUrlContentMd5 = exports.queryUrlContentMd5 = exports.deleteFile = exports.copyFile = exports.renameFile = exports.fileIsExist = exports.downLoadFile = exports.saveFile = exports.saveReport = exports.saveTaskRes = void 0;
require("dotenv/config");
const promise_1 = __importDefault(require("mysql2/promise"));
const log4js_1 = __importDefault(require("log4js"));
const logger = log4js_1.default.getLogger('sql');
const dbConf = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
async function query(...args) {
    const conn = await promise_1.default.createConnection(dbConf);
    return (conn
        .query(...args)
        .then((res) => res[0])
        .finally(() => conn.end()));
}
const saveTaskRes = async (res) => {
    const SQL = `INSERT INTO t_task_res ( Ftask_id, Fpage_id, Ftask_type, Fenv, Ftask_res, Ffrom, Fcreate_at ) VALUES ( ?, ?, ?, ?, ?, ?, NOW() );`;
    const { taskId, pageId, taskType, env, result, from } = res;
    const resultStr = JSON.stringify(result);
    return query(SQL, [taskId, pageId || 0, taskType, env, resultStr, from])
        .catch((e) => {
        if ((e === null || e === void 0 ? void 0 : e.code) === 'ER_DUP_ENTRY') {
            logger.warn(`超时任务竞争，放弃任务结果`);
            return null;
        }
        else {
            logger.error("保存任务结果失败\n", e);
            return Promise.reject(e);
        }
    });
};
exports.saveTaskRes = saveTaskRes;
const saveReport = async ({ record, md5 }) => {
    const msg = `保存报告: ${md5}`;
    const SQL = `INSERT INTO t_lighthouse_report ( Frecord, Fmd5 ) VALUES ( ?, ? );`;
    return query(SQL, [JSON.stringify(record), md5])
        .then((res) => {
        logger.trace(msg, "成功");
        return res;
    })
        .catch((e) => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.saveReport = saveReport;
const saveFile = async ({ name, file, mimeType }) => {
    const msg = `保存文件 ${name}`;
    const SQL = `INSERT INTO t_screenshot (name, mimeType, file) VALUES (?, ?, ?)  ON DUPLICATE KEY UPDATE file=?;`;
    const values = [name, mimeType, file, file];
    return query(SQL, values)
        .then((res) => {
        logger.trace(msg, "成功");
        return res;
    })
        .catch((e) => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.saveFile = saveFile;
const downLoadFile = async (name) => {
    const msg = `下载文件 ${name}`;
    const SQL = `SELECT file FROM t_screenshot WHERE name='${name}';`;
    return query(SQL)
        .then((res) => {
        const data = res[0];
        if (data === null || data === void 0 ? void 0 : data.file) {
            logger.trace(msg, "成功");
            return data;
        }
        else {
            return Promise.reject(res);
        }
    })
        .catch((e) => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.downLoadFile = downLoadFile;
const fileIsExist = async (name) => {
    const SQL = `SELECT count(*) FROM t_screenshot WHERE name='${name}';`;
    return query(SQL).then((res) => Boolean(res[0]["count(*)"]));
};
exports.fileIsExist = fileIsExist;
const renameFile = async (origin, target) => {
    const msg = `重命名文件 ${origin} --> ${target}`;
    const SQL = `UPDATE t_screenshot SET name='${target}' WHERE name='${origin}';`;
    return query(SQL)
        .then((res) => {
        if (res.affectedRows === 0)
            return Promise.reject(`找不到 ${origin}`);
        logger.trace(msg, "成功");
        return res;
    })
        .catch((e) => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.renameFile = renameFile;
const copyFile = async (from, to) => {
    const msg = `复制文件 ${from} ${to}`;
    const SQL = `INSERT INTO t_screenshot (name, file) SELECT "${to}", file FROM t_screenshot WHERE name = "${from}"`;
    await (0, exports.deleteFile)(to);
    return query(SQL)
        .then((res) => {
        if (res.affectedRows === 0)
            return Promise.reject(`找不到 ${from}`);
        logger.trace(msg, "成功");
        return res;
    })
        .catch((e) => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.copyFile = copyFile;
const deleteFile = async (name) => {
    const msg = `删除文件 ${name}`;
    const SQL = `DELETE FROM t_screenshot WHERE name=?`;
    return query(SQL, [name])
        .then(res => {
        logger.trace(msg, '成功');
        return res;
    })
        .catch(e => {
        logger.error(msg, "失败\n", e);
        return Promise.reject(e);
    });
};
exports.deleteFile = deleteFile;
const queryUrlContentMd5 = async (url, proxyID = 0) => {
    const SQL = `SELECT * FROM t_md5 WHERE Furl=? AND FproxyID=?;`;
    return query(SQL, [url, proxyID])
        .then(res => {
        const { Fmd5, Fmd5Pre } = res[0] || {};
        return [Fmd5, Fmd5Pre];
    });
};
exports.queryUrlContentMd5 = queryUrlContentMd5;
const upsertUrlContentMd5 = async (url, proxyID = 0, currentMD5, preMD5) => {
    const SQL = `INSERT INTO t_md5 (Furl, Fmd5, Fmd5Pre, FproxyID) VALUES (?, ?, ?, ?)  ON DUPLICATE KEY UPDATE Fmd5=?, Fmd5Pre=?, FproxyID=?;`;
    return query(SQL, [url, currentMD5, preMD5, proxyID, currentMD5, preMD5, proxyID]);
};
exports.upsertUrlContentMd5 = upsertUrlContentMd5;
const queryConf = key => {
    const SQL = `SELECT * FROM t_conf WHERE Fkey=?;`;
    return query(SQL, [key])
        .then(res => {
        const { Fvalue } = (res === null || res === void 0 ? void 0 : res[0]) || {};
        return Fvalue || null;
    });
};
exports.queryConf = queryConf;
const upsertConf = (key, value) => {
    const SQL = `INSERT INTO t_conf (Fkey, Fvalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE Fvalue=?;`;
    const valueStr = JSON.stringify(value);
    return query(SQL, [key, valueStr, valueStr]);
};
exports.upsertConf = upsertConf;
//# sourceMappingURL=mysql.js.map