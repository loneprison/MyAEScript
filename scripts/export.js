const fs = require('fs');
const path = require('path');

// 文件夹路径
const folderPath = 'utils'; // 请根据实际情况修改路径
const outputFileName = 'index.ts'; // 输出文件名

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
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.tsx') && file !== outputFileName)
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
  const files = getTSXFiles(dir);
  if (files.length === 0) {
    console.log('没有找到 .tsx 文件。');
    return;
  }

  const content = generateExports(files);
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已生成 ${filePath}`);
}

// 执行
createIndexFile(folderPath, outputFileName);
