import parseVideo from "./parseVideo";

export default async function() {
  const argv = process.argv?.[2];
  if (argv) {
    console.log(argv);
    await parseVideo(argv);
  } else {
    console.info('缺少指定视频链接')
  }
}