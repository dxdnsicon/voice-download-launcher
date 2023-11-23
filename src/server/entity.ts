import logger from '../utils/log';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, IS_MACOS } from '../config';
import { createConnection } from "typeorm";

export const init = () => {
  // 初始化数据库连接
  logger('start mysql connect')
  const DB_CONF = {
    "type": "mysql",
    "host": DB_HOST,
    "port": DB_PORT,
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": IS_MACOS ? "commonDB_test" : "commonDB",
    "synchronize": false,
    "logging": !!IS_MACOS,
    "entities": ["es/entity/*.js"]
  }

  // @ts-ignore
  createConnection(DB_CONF)
    .then(connection => {
      // 这里可以写实体操作相关的代码
      logger('connect mysql')
    })
    .catch(error => console.log(error));
}