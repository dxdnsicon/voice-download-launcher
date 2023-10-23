import { ProcessRsp, TaskProps, ProcessState } from "../../typings/task";
import parseVideo from "../../components/parseVideo";

const start = (data: TaskProps) => {
  console.log('start', start)
  parseVideo(data.link, (res: ProcessRsp) => {
    process.send({
      id: data.id,
      res: {
        time: +new Date(),
        ...res
      }
    })
  });
}

if (process.env.IS_CHILD === '1') {
  process.on('message', (data: TaskProps) => {
    process.send({
      id: data.id,
      res: {
        name: ProcessState.INIT,
        time: +new Date(),
      }
    })
    console.log('child message', data);
    start(data);
  });
}
