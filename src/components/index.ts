import parseVideo from "./parseVideo";

export default async function() {
  const argv = process.argv?.[2];
  if (argv) {
    console.log(argv);
    await parseVideo(argv);
  } else {
    throw '请输入糖豆页面链接'
  }
}