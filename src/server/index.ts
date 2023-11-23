import express from 'express'
import cors from 'cors'
import createError from 'http-errors'
import { API_PREFIX, SERVER_PORT } from '../typings/constant';
import logger from '../utils/log';
import getTask from './Task/index';
import { init } from './entity'

const pkgJson = require('../../package.json');

const createHttpServer = () => {
  init();
  const http = express();
  http.use(cors({ origin: true }))  // See https://expressjs.com/en/resources/middleware/cors.html#configuration-options
  http.use(express.json());
  http.use(express.urlencoded({ extended: false }));
  /**
   * 静态文件
   */
  http.use('/front', express.static('public'))

  http.use('/static/dist', express.static('dist'))

  /**
   * 主要 API
   */
  http.use(`${API_PREFIX}/task`, getTask())  // launcher


  /**
   * 返回 MasterLauncher 版本号（package.json）
   */
  http.use(`${API_PREFIX}/version`, (req, res) => {
    res.json({ version: pkgJson.version })
  })

  /**
   * 返回 MasterLauncher 环境变量
   */
  http.use(`${API_PREFIX}/env`, (req, res) => {
    res.json(process.env)
  })


  /**
   * 健康检查
   */
  http.use(`/health`, (req, res) => {
    res.send("I'm Fine")
  })



  /**
   * 404
   */
  http.use(function (req, res, next) {
    next(createError(404));
  });


  /**
   * 错误处理
   */
  http.use(function (err, req, res, next) {
    if (res.headersSent) return next(err)
    res.status(500)
    res.json({ message: err?.message, stack: err?.stack })
  })

  logger('HTTP Server start ...')
  const port = SERVER_PORT || 80;
  http.listen(port, () => logger(`HTTP Server start at http://127.0.0.1:${port}`));
  return http
}

const httpServer = createHttpServer()

process.on('unhandledRejection', (reason: any) => {
  console.error('UnhandledRejection', reason?.message, reason?.stack);
});

process.on('uncaughtException', (reason) => {
  console.error('uncaughtException', reason?.message, reason?.stack);
});
