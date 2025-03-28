const fs = require('fs');
const path = require('path');

// 文件夹路径
const folderPath = 'src\\utils'; // 确保这是一个实际存在的文件夹路径
const outputFileName = 'index.ts'; // 输出文件名

// 检查路径是否为目录
function ensureDirectoryExists(dir) {
  console.log(`检查路径: ${dir}`); // 调试日志
  if (!fs.existsSync(dir)) {
    throw new Error(`路径不存在: ${dir}`);
  }
  const stats = fs.statSync(dir);
  console.log(`路径类型: ${stats.isDirectory() ? '目录' : '文件'}`); // 调试日志
  if (!stats.isDirectory()) {
    throw new Error(`路径不是一个目录: ${dir}`);
  }
}

// 分析文件内容中的导出信息
function analyzeExports(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // 匹配 export { ... } 格式的命名导出
  const namedExportGroupRegex = /export\s+\{\s*([\w,\s]+)\s*\}/;
  // 匹配独立命名导出
  const namedExportRegex = /export\s+(?:const|function|let|var)\s+(\w+)/g;
  // 匹配默认导出
  const defaultExportRegex = /export\s+default\s+(\w+)/;

  const namedExports = [];
  const namedGroupMatch = fileContent.match(namedExportGroupRegex);
  if (namedGroupMatch) {
    namedExports.push(...namedGroupMatch[1].split(',').map(e => e.trim()));
  }

  let match;
  while ((match = namedExportRegex.exec(fileContent)) !== null) {
    namedExports.push(match[1]);
  }

  const defaultExport = fileContent.match(defaultExportRegex)?.[1] || null;

  return { namedExports, defaultExport };
}

// 获取所有 .tsx 文件
function getTSXFiles(dir) {
  console.log(`读取目录内容: ${dir}`); // 调试日志
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.tsx') && file !== outputFileName) // 确保排除 index.ts
    .map(file => ({
      name: path.parse(file).name,
      path: path.join(dir, file),
    }));
}

// 生成 index.ts 文件内容
function generateExports(files) {
  return files
    .map(({ name, path }) => {
      const { namedExports, defaultExport } = analyzeExports(path);

      if (namedExports.length > 0) {
        // 如果存在命名导出，直接生成对应的导出语句
        return `export { ${namedExports.join(', ')} } from './${name}';`;
      } else if (defaultExport) {
        // 如果只有一个默认导出
        return `export { default as ${name} } from './${name}';`;
      }
      return ''; // 没有任何导出时返回空字符串
    })
    .filter(Boolean) // 去掉空字符串
    .join('\n\n');
}

// 写入 index.ts 文件
function createIndexFile(dir, fileName) {
  ensureDirectoryExists(dir); // 添加路径检查

  const filePath = path.join(dir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(`删除旧文件: ${filePath}`); // 调试日志
    fs.unlinkSync(filePath); // 删除旧的 index.ts 文件
  }

  const files = getTSXFiles(dir);
  if (files.length === 0) {
    console.log('没有找到 .tsx 文件。');
    return;
  }

  const content = generateExports(files);

  console.log(`生成文件路径: ${filePath}`); // 调试日志
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已生成 ${filePath}`);
}

// 执行
createIndexFile(folderPath, outputFileName);
