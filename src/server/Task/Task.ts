import { ProcessRsp, TaskProps } from "../../typings/task";
import parseVideo from "../../components/parseVideo";

const start = (data: TaskProps) => {
  console.log('start', start)
  parseVideo(data.link, (res: ProcessRsp) => {
    process.send({
      id: data.id,
      time: +new Date(),
      res
    })
  });
}

if (process.env.IS_CHILD === '1') {
  process.on('message', (data: TaskProps) => {
    console.log('child message', data);
    start(data);
  });
}
