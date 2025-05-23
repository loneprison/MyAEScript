const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { readdirSync, statSync, copyFileSync, rmSync, readFileSync } = require("fs");
const { resolve, extname, basename, dirname, relative } = require("path");

const minutes = 0.08;
const inputDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");
const now = Date.now();
const modifiedTimeLimit = now - minutes * 60 * 1000;

// 递归遍历目录
const walk = (dir) => {
    const files = [];
    readdirSync(dir).forEach((f) => {
        const fullPath = resolve(dir, f);
        // 如果是 src/utils 目录，跳过
        if (fullPath.includes('src/utils')) return;
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            files.push(...walk(fullPath));
        } else if (extname(f) === ".tsx" && stats.mtimeMs >= modifiedTimeLimit) {
            files.push(fullPath);
        }
    });
    return files;
};

const recentFiles = walk(inputDir);

if (recentFiles.length === 0) {
    console.log(`没有在过去 ${minutes} 分钟内修改的 .tsx 文件。`);
    process.exit(0);
}

// 清理 dist 目录中多余的文件和目录
const cleanDist = (srcDir, distDir) => {
    const srcFiles = new Set(readdirSync(srcDir).map((f) => resolve(srcDir, f)));
    const distFiles = readdirSync(distDir).map((f) => resolve(distDir, f));

    distFiles.forEach((distFile) => {
        const stats = statSync(distFile);
        const distExt = extname(distFile);
        const relPath = distFile.slice(distDir.length + 1); // 获取相对路径
        const srcFile = resolve(srcDir, relPath.replace(/\.jsx$/, ".tsx")); // 假设它可能是由 .tsx 生成

        if (stats.isDirectory()) {
            // 如果是目录，递归处理之前先检查 src 中是否存在该目录
            if (srcFiles.has(srcFile)) {
                cleanDist(srcFile, distFile); // 如果 src 中存在该目录，才递归
            } else {
                // 如果 src 中没有该目录，删除 dist 中的目录
                console.log(`删除目录 ${distFile}`);
                rmSync(distFile, { recursive: true, force: true });
            }
            return;
        }

        const srcExists = srcFiles.has(srcFile);

        if (srcExists) {
            const srcExt = extname(srcFile);

            if (distExt === ".jsx" && srcExt === ".tsx") {
                // 如果 .jsx 文件对应 .tsx 文件，则保留
                return;
            }

            // 删除与 .tsx 文件同名但后缀不为 .jsx 的文件
            console.log(`删除文件 ${distFile}`);
            rmSync(distFile, { force: true });
        } else {
            // 如果 src 中不存在对应的文件，删除 dist 文件
            console.log(`删除文件 ${distFile}`);
            rmSync(distFile, { force: true });
        }
    });
};

// 清理 dist 目录
console.log("清理 dist 目录中...");
cleanDist(inputDir, distDir);
console.log("dist 目录清理完成。");

// 复制非 .tsx 文件
const copyNonTsxFiles = (inputPath, outputPath) => {
    const inputDir = dirname(inputPath);
    const outputDir = dirname(outputPath);

    try {
        require("fs").mkdirSync(outputDir, { recursive: true });
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

// 自定义插件：替换占位符为图片数据
// 使用方法：在 .tsx 文件中使用 __IMAGE_PLACEHOLDER__(图片路径) 占位符，例如 __IMAGE_PLACEHOLDER__(./images/icon.png)
const replacePlaceholders = () => {
    return {
        name: 'replace-placeholders',
        transform(code, id) {
            if (extname(id) !== '.tsx') return null;

            // 替换占位符
            const placeholderRegex = /__IMAGE_PLACEHOLDER__\((.*?)\)/g;
            let match;
            let transformedCode = code;

            while ((match = placeholderRegex.exec(code)) !== null) {
                const imagePath = match[1];
                const imageData = readFileSync(resolve(__dirname, imagePath), 'base64');
                transformedCode = transformedCode.replace(match[0], `"data:image/png;base64,${imageData}"`);
            }

            return {
                code: transformedCode,
                map: null
            };
        }
    };
};

const configs = recentFiles.map((file) => {
    const inputPath = file;
    const outputPath = file.replace(inputDir, distDir).replace(extname(file), ".jsx");

    // 复制非 .tsx 文件
    copyNonTsxFiles(inputPath, outputPath);

    return {
        input: inputPath,
        output: {
            file: outputPath,
            // format: "iife",
            intro: "(function () {",
            outro: "}).call(this);",
            sourcemap: false,
        },
        plugins: [
            typescript(),
            replacePlaceholders(), // 添加自定义插件
            terser({
                compress: false,
                mangle: false,
                format: {
                    beautify: true,
                    braces: true,
                    comments: false,
                    keep_quoted_props: true,
                    keep_numbers: true,
                    preamble: [
                        "// 本脚本基于Soil/at_script开发",
                        "// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)",
                        "// Soil Github: https://github.com/RaymondClr/Soil",
                        "",
                        `// - ${new Date().toLocaleString()}`,
                    ].join("\n"),
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