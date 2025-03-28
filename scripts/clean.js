/*
    npm run clean
    用于清理tsc文件
*/

const fs = require('fs');
const path = require('path');

// 定义要检查的目录
const directories = ['./src'];

// 获取指定目录及其子目录中的所有文件
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

// 删除和 .tsx 或 .ts 同名的 .jsx 文件
function deleteMatchingJSX(files) {
    const tsFiles = files.filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

    tsFiles.forEach(tsFile => {
        const jsxFile = tsFile.replace(/\.(tsx|ts)$/, '.jsx');
        if (fs.existsSync(jsxFile)) {
            fs.unlinkSync(jsxFile);
            console.log(`Deleted: ${jsxFile}`);
        }
    });
}

// 主函数
function main() {
    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = getAllFiles(dir);
            deleteMatchingJSX(files);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    });
}

// 执行主函数
main();
