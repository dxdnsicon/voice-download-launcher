/*
 * @Author: shiningding <shiningding@tencent.com>
 * @Date: 2021-05-06 17:15:21
 * @--------------------------------------------------: 
 * @LastEditTime: 2023-10-23 17:43:04
 * @Modified By: shiningding <shiningding@tencent.com>
 * @---------------------------------------------------: 
 * @Description: 日志输出
 */

import formateTime from './time'

const color = ['\x1B[31m%s\x1B[0m', '\x1B[36m%s\x1B[0m',  '\x1B[32m%s\x1B[0m', '\x1B[33m%s\x1B[0m', '\x1B[34m%s\x1B[0m', '\x1B[35m%s\x1B[0m', '\x1B[41m%s\x1B[0m', '\x1B[42m%s\x1B[0m', '\x1B[43m%s\x1B[0m', '\x1B[44m%s\x1B[0m', '\x1B[45m%s\x1B[0m', '\x1B[46m%s\x1B[0m', ];

const definedLog = console.log;

function log(...args) {
  if (global.page) {
    definedLog(color[global.page - 1],`${formateTime(new Date(), 'yyyy-MM-dd hh:mm:ss')}-child${global.page}:`, ...args);
  } else {
    definedLog(color[0], `${formateTime(new Date(), 'yyyy-MM-dd hh:mm:ss')}: `, ...args);
  } 
}

console.log = log;

export default log;