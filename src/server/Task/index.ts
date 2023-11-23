import express from 'express'
import { fork } from 'child_process';
import * as path from 'path';
import createError from 'http-errors'
import { v4 as uuidv4 } from 'uuid';
import { TaskProps, ProcessRsp } from '../../typings/task';
import { getRepository } from 'typeorm';
import { TaskModel } from '../../entity/task.model'

const PROCESS_MAP: Record<string, ProcessRsp[]> = {};

const ONE_DAY = 86400000;

const clearMap = () => {
  const now = Date.now();
  for (let i in PROCESS_MAP) {
    const item = PROCESS_MAP[i];
    item?.[0]?.time < now - ONE_DAY;
    delete PROCESS_MAP[i];
  }
}

const forkChild = (data: TaskProps) => {
  const child = fork(
    path.join(__dirname, 'Task.js'),
    [],
    {
      execPath: process.env.NODE,  
      env: { ...process.env, IS_CHILD: '1'}  // 注入环境变量给到子进程
    }
  );
  child.send(data)
  child.on('message', async (params: {
    id: string;
    res: ProcessRsp
  }) => {
    const { id, res } = params;
    let task = await getRepository(TaskModel).findOne({ where: { Ftask_id: id}});
    if (task) {
      task.Fjson.push(res);
      if (res?.data?.name) {
        task.Fname = res.data.name
      }
    } else {
      task = new TaskModel();
      task.Fname = '获取中....';
      task.Fstatus = res?.name;
      task.Ftask_id = id;
      task.Fjson = [res]
    }
    await getRepository(TaskModel).save(task);
    // 
  })  // 桥接 child process 
}



export default () => {
  const router = express.Router()

  router.post('/all', async (req, res, next) => {
    let task = await getRepository(TaskModel).find({
      order: { Fupdate_time: 'DESC'}
    });
    return res.json({
      code: 0,
      data: task
    });
  });

  router.post('/:id', async (req, res, next) => {
    const { id } = req.params;
    return res.json({
      code: 0,
      data: PROCESS_MAP[id] || []
    });
  });

  router.post('/', async (req, res, next) => {
    const { link } = req.body;
    const id = uuidv4();
    if (!link) return next(createError(400, `params error`))
    forkChild({
      id,
      link
    });
    return res.json({
      code: 0,
      id,
    });
  });

  return router
}