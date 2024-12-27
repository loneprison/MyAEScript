const fs = require("fs"); // 引入 fs 模块
const path = require("path");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { readdirSync, statSync, copyFileSync, rmSync } = require("fs");
const { resolve, extname, basename, dirname, relative } = require("path");

const minutes = 0.08;
const inputDirs = [resolve(__dirname, "src"), resolve(__dirname, "wip")];
const distDir = resolve(__dirname, "dist");
const now = Date.now();
const modifiedTimeLimit = now - minutes * 60 * 1000;

// 递归遍历目录
const walk = (dirs) => {
    const files = [];
    dirs.forEach((dir) => {
        readdirSync(dir).forEach((f) => {
            const fullPath = resolve(dir, f);
            const stats = statSync(fullPath);
            if (stats.isDirectory()) {
                files.push(...walk([fullPath]));
            } else if (extname(f) === ".tsx" && stats.mtimeMs >= modifiedTimeLimit) {
                files.push(fullPath);
            }
        });
    });
    return files;
};

const recentFiles = walk(inputDirs);

if (recentFiles.length === 0) {
    console.log(`没有在过去 ${minutes} 分钟内修改的 .tsx 文件。`);
    process.exit(0);
}

// 清理 dist 目录中多余的文件和目录
const cleanDist = (inputDirs, distDir) => {
    const allDistFiles = readdirSync(distDir).map((file) => resolve(distDir, file));

    inputDirs.forEach((srcDir) => {
        const subDir = srcDir.includes("src") ? "src" : "wip";
        const currentDistDir = resolve(distDir, subDir);

        if (!fs.existsSync(currentDistDir)) {
            console.log(`目标目录 ${currentDistDir} 不存在，创建目录...`);
            fs.mkdirSync(currentDistDir, { recursive: true });
        }

        // 遍历 dist 中的文件
        const distFiles = readdirSync(currentDistDir).map((file) =>
            resolve(currentDistDir, file)
        );
        distFiles.forEach((distFile) => {
            const relPath = relative(currentDistDir, distFile).replace(
                /\.jsx$/,
                ".tsx"
            );
            const srcFile = resolve(srcDir, relPath);

            if (!fs.existsSync(srcFile)) {
                console.log(`删除多余文件或目录: ${distFile}`);
                rmSync(distFile, { recursive: true, force: true });
            }
        });
    });
};

// 清理 dist 目录
console.log("清理 dist 目录中...");
cleanDist(inputDirs, distDir);
console.log("dist 目录清理完成。");

// 复制非 .tsx 文件
const copyNonTsxFiles = (inputPath, outputPath) => {
    const inputDir = dirname(inputPath);
    const outputDir = dirname(outputPath);

    try {
        fs.mkdirSync(outputDir, { recursive: true });
    } catch (e) {
        console.error(`无法创建输出目录 ${outputDir}: ${e.message}`);
    }

    readdirSync(inputDir).forEach((f) => {
        const fullPath = resolve(inputDir, f);
        const stats = statSync(fullPath);
        if (!stats.isDirectory() && extname(f) !== ".tsx") {
            const outputFilePath = resolve(outputDir, f);
            copyFileSync(fullPath, outputFilePath);
            console.log(`复制文件 ${fullPath} 到 ${outputFilePath}`);
        }
    });
};

// 配置打包
const configs = recentFiles.map((file) => {
    const inputPath = file;

    // 确定文件所属的源目录
    const sourceDir = inputDirs.find((dir) => file.startsWith(dir));
    if (!sourceDir) {
        return; // 如果文件不在 src 或 wip 中，跳过
    }

    // 获取相对路径，并在 dist 下根据源目录创建子目录
    const relativePath = relative(sourceDir, file);
    const subDir = sourceDir.includes("src") ? "src" : "wip"; // 根据源目录区分子目录
    const outputPath = resolve(distDir, subDir, relativePath).replace(
        extname(file),
        ".jsx"
    );

    // 复制非 .tsx 文件
    copyNonTsxFiles(inputPath, outputPath);

    return {
        input: inputPath,
        output: {
            file: outputPath,
            intro: "(function () {",
            outro: "}).call(this);",
            sourcemap: false,
        },
        plugins: [
            typescript(),
            terser({
                compress: false,
                mangle: false,
                format: {
                    beautify: true,
                    braces: true,
                    comments: false,
                    keep_quoted_props: true,
                    keep_numbers: true,
                    preamble: `// 本脚本基于Soil开发\n// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)\n// Soil Github: https://github.com/RaymondClr/Soil\n\n// 脚本作者: loneprison (qq: 769049918)\n// Github: https://github.com/loneprison/MyAEScript\n// - ${new Date().toLocaleString()}\n`,
                    wrap_func_args: false,
                },
            }),
        ],
        treeshake: {
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
        },
        context: "this",
    };
});

module.exports = configs;
