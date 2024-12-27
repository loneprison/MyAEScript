const { exec } = require("child_process");
const chokidar = require("chokidar");
const path = require("path");

const srcDir = path.resolve(__dirname, "../src");
const wipDir = path.resolve(__dirname, "../wip");

// 创建监视器
const watcher = chokidar.watch([srcDir, wipDir], {
    ignored: [/node_modules/, /@types/, /utils/], // 忽略规则
    persistent: true,
    ignoreInitial: true,
});

console.log(`正在监视以下目录中的 .tsx 文件修改：`);
console.log(`1. ${srcDir}`);
console.log(`2. ${wipDir}`);

// 监听文件变化事件
watcher.on("change", (filePath) => {
    console.log(`检测到文件变动：${filePath}，开始编译...`);
    exec("npm run build", (err, out, errOutput) => {
        if (err) {
            console.error(`编译出错：\n${errOutput}`);
        } else {
            console.log(`编译完成：\n${out}`);
        }
    });
});
