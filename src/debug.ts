/**
 * 调试入口
 */
 import path from "path";
import Core from './components/index'
 
 class Debugger {
   constructor() {
     const debugFn = this[process.env.DEBUG_FN]?.bind(this)
     debugFn ? debugFn() : console.warn(`找不到需要调试的函数 DEBUG_FN=${process.env.DEBUG_FN}`)
   }
 
 
   /**
    * 调试下载任务
    */
   async startCore() {
    return await Core()
   }
 }
 
 
 new Debugger()